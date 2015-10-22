from collections import defaultdict
import re

class Stat():
    def f(self, comment):
        return

    def collect(self, comment):
        """Collect stat from comment and report in collection"""
        self.f(comment)

class CounterStat(Stat):
    """A stat that keeps a dictionary of key strings and counts"""
    counter = defaultdict(int)

class WordCount(CounterStat):
    def __init__(self, collection_name, boring_words):
        super().__init__()
        self.boring_words = boring_words

    def f(self, comment):
        body = re.sub("[\[\].\"\()?*!]", " ", comment.body).lower().split()
        words = [w for w in body if w not in self.boring_words]
        for word in words:
            self.counter[word] += 1

class AuthorCommentsCount(CounterStat):
    def f(self, comment, collector):
        self.counter[comment.author.name] += 1

class FlairCount(CounterStat):
    def f(self, comment):
        self.[self.collection_name][comment.author_flair_text] += 1

with open("./boring_words.txt", "r") as f:
    boring_words = [line.strip() for line in f]

stats = [
     WordCount("word_count", boring_words),
     AuthorCommentsCount("commenters"),
     FlairCount("flair_count")
]
