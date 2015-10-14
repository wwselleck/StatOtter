from lib.logger import Logger
from lib.winniebot import WinnieBot

def run():
  logger = Logger()
  logger.logSmall("Hello")

if __name__ == "__main__":
    bot = WinnieBot(Logger())
    bot.run()
