from lib.logger import Logger
from lib.winniebot import WinnieBot
from lib.modes.thread import ThreadMode
import praw
import yaml

if __name__ == "__main__":
    with open("./config.yaml", "r") as f:
      config = yaml.safe_load(f)
    print(config)
    user_agent = "StatOtter v{:s} by {:s} [{:s}]".format(config['version'], config['author'], config['email'])
    r = praw.Reddit(user_agent=user_agent)
    r.login()
    modes = {
        "thread": ThreadMode(r, Logger())
    }
    bot = WinnieBot(r, Logger(), modes, {"subreddit": config['target_subreddit']})
    bot.run()
