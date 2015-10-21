from time import sleep
from pprint import pprint
from collections import defaultdict
import praw
import operator

class WinnieBot:
    def __init__(self, reddit, logger, stats, options):
        self.reddit = reddit
        self.logger = logger
        self.stats = stats
        self.options = options

    def run(self):
        """Run the bot"""
        while True:
            self.logger.logLarge("Running...")
            recent_comments = self.reddit.get_comments(self.options['subreddit'], limit=100)
            print(recent_comments)
            for comment in recent_comments:
                if "WinnieBot!" in comment.body:
                    self.logger.logMedium('Comment Match Found!')
                    pprint(vars(comment))
                    self._process_matching_comment(comment)
            self.logger.logLarge("Sleeping...")
            sleep(10)
            self.logger.logLarge("Awake!")

    def _process_matching_comment(self, comment):
        """Process a comment match, analyze comments and reply with stats"""
        submission_id = comment.link_id[3:]
        submission = self.reddit.get_submission(submission_id=submission_id)

        self.logger.logMedium("Matching Comment Submission")
        pprint(vars(submission))

        self.logger.logMedium("Replacing more comments...")

        #Replace all of the "More Comments" comments with the actual comments
        submission.replace_more_comments(limit=None, threshold=0)
        all_comments = submission.comments

        #Flatten the new tree of all comments
        all_comments = praw.helpers.flatten_tree(all_comments)

        report = {"number_of_comments": len(all_comments)}

        for c in all_comments:
            for s in self.stats:
                s.collect(c, report)

        pprint(report)


    def _sort_dict_by_values(self, d):
        return sorted(d.items(), key=operator.itemgetter(1), reverse=True)
