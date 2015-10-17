from lib.logger import Logger
from lib.winniebot import WinnieBot
import praw
import yaml

if __name__ == "__main__":
    with open("./config.yaml", "r") as f:
      config = yaml.safe_load(f)
    with open(config["restricted_words_file_path"], "r") as f:
      boring_words = [line.strip() for line in f]
    print(config)
    print(boring_words)
    user_agent = "Winnie v{:s} by {:s} [{:s}]".format(config['version'], config['author'], config['email'])
    r = praw.Reddit(user_agent=user_agent)
    bot = WinnieBot(r, Logger(), boring_words, {"subreddit": config['target_subreddit']})
    bot.run()
