from lib.modes.mode import Mode
from lib.stats import CounterStat
from lib.reddithelpers import dictionary_to_table
from pprint import pprint
import praw
import re

class WordCount(CounterStat):
    def __init__(self, boring_words, **options):
        super().__init__(**options)
        self._boring_words = boring_words

    def f(self, comment):
        body = re.sub("[\[\].\"\()?*!]", " ", comment.body).lower().split()
        words = [w for w in body if w not in self._boring_words]
        for word in words:
            self._counter[word] += 1

class AuthorCommentsCount(CounterStat):
    def f(self, comment):
        pprint(vars(comment))
        if comment.author:
            self._counter[comment.author.name] += 1

class FlairCount(CounterStat):
    def f(self, comment):
        self._counter[comment.author_flair_text] += 1

class ThreadMode(Mode):
    def __init__(self, reddit, logger):
        self.reddit = reddit
        self.logger = logger
        with open("./boring_words.txt", "r") as f:
            boring_words = [line.strip() for line in f]

        self.stats = [
            WordCount (boring_words, title='Word Count', sort='decr'),
            AuthorCommentsCount(title='Commenter Comments', sort='decr'),
            FlairCount(title='Flair Count', sort='decr')
        ]

    def handle(self, comment):
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

        for c in all_comments:
            for s in self.stats:
                s.collect(c)

        self.logger.logMedium("Reporting Stats")
        for s in self.stats:
            self.logger.logSmall(s.title)
            pprint(s.data)

        comment.reply(self._report(comment, self.stats[0].data))

    def _report(self, comment, data):
        s = dictionary_to_table(data, 'Word', 'Number of Times Used')
        return s


