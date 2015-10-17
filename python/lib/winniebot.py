from time import sleep
from pprint import pprint
from collections import defaultdict
import praw
import operator

class WinnieBot:
    def __init__(self, reddit, logger, boring_words, options):
        self.reddit = reddit
        self.logger = logger
        self.boring_words = boring_words
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

        stats = {
                "number_of_comments": len(all_comments),
                "commenters": defaultdict(int),
                "flairs": defaultdict(int),
                "words": defaultdict(int)
        }

        for c in all_comments:
            self._collect_stats_from_comment(c, stats)

        stats_to_report = {
            "number_of_comments": stats["number_of_comments"],
            #@see http://stackoverflow.com/questions/613183/sort-a-python-dictionary-by-value
            "commenters": self._sort_dict_by_values(stats["commenters"]),
            "flairs":  self._sort_dict_by_values(stats["flairs"]),
            "words": self._sort_dict_by_values(stats["words"])
        }
        pprint(stats_to_report)

    def _collect_stats_from_comment(self, comment, stats):
        self.logger.logSmall("Analyzing comment {:s}".format(comment.id))
        pprint(vars(comment))

        #Increment commenter count
        stats["commenters"][comment.author.name] += 1

        #Remove boring words and lowercase all words
        words = [w.lower() for w in comment.body.split() if w.lower() not in self.boring_words]
        for word in words:
            stats["words"][word] += 1

        flair = comment.author_flair_text
        stats["flairs"][flair]  += 1

    def _sort_dict_by_values(self, d):
        return sorted(d.items(), key=operator.itemgetter(1), reverse=True)
