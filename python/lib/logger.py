class Logger():
    def logSmall(self, text):
        print("------------------------------------")
        print("- {:s}".format(text))
        print("------------------------------------")

    def logMedium(self, text):
        print("=======================================")
        print("= {:s}".format(text))
        print("=======================================")

    def loglarge(self, text):
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        print("> {:s}".format(text))
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
