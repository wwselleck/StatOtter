from time import sleep
class WinnieBot:
    def __init__(self, logger):
        self.logger = logger

    def run(self):
        while True:
            self.logger.logMedium("Running...")
            sleep(2)
