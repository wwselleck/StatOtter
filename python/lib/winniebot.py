from time import sleep
from pprint import pprint

class WinnieBot:
    def __init__(self, reddit, logger, options):
        self.reddit = reddit
        self.logger = logger
        self.options = options

    def run(self):
        while True:
            self.logger.logMedium("Running...")
            recent_comments = self.reddit.get_comments(self.options['subreddit'])
            for comment in recent_comments:
                if "WinnieBot!" in comment.body:
                    self.logger.logMedium('Comment Match Found!')
                    pprint(vars(comment))
                    self.process_comment(comment)
            sleep(2)

    def process_comment(comment):
        #todo
