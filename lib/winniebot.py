from time import sleep
from pprint import pprint
from collections import defaultdict
import praw
import operator

class WinnieBot:
    def __init__(self, reddit, logger, modes, options):
        self.reddit = reddit
        self.logger = logger
        self.modes = modes
        self.options = options

    def run(self):
        """Run the bot"""
        while True:
            self.logger.logLarge("Running...")
            recent_comments = self.reddit.get_comments(self.options['subreddit'], limit=100)
            for comment in recent_comments:
                split_body = comment.body.strip().split(' ')
                if split_body[0] == 'StatOtter!':
                    self.logger.logMedium('Comment Match Found!')
                    if len(split_body) == 1:
                        self.modes['thread'].handle(comment)
                    else:
                        mode = split_body[1]
                        if mode in self.modes:
                            self.modes[mode].handle(comment)
                        else:
                            self.logger.logLarge('INVALID MODE %s REQUESTED'.format(mode))
            self.logger.logLarge('Sleeping...')
            sleep(10)
            self.logger.logLarge('Awake!')
