class Logger():
    def logSmall(self, text):
        print("------------------------------------")
        print("- {:s}".format(text))
        print("------------------------------------")

    def logMedium(self, text):
        print("=======================================")
        print("= {:s}".format(text))
        print("=======================================")

    def logLarge(self, text):
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        print("> {:s}".format(text))
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
