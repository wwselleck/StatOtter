from lib.logger import Logger
from lib.winniebot import WinnieBot
import praw
import yaml

if __name__ == "__main__":
    with open("./config.yaml", "r") as f:
      config = yaml.safe_load(f)
    print(config)
    user_agent = "WinnieBot v{:s} by {:s} [{:s}]".format(config['version'], config['author'], config['email'])
    r = praw.Reddit(user_agent=user_agent)
    bot = WinnieBot(Logger())
    bot.run()
