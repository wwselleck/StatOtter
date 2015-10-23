from collections import defaultdict
import operator

class Stat():

    def __init__(self, title='No Title', sort=None):
        self.title = title
        self._sort = sort

    def f(self, comment):
        pass

    @property
    def data(self):
        return {"No data": None}

    def collect(self, comment):
        """Collect stat from comment and report in collection"""
        self.f(comment)

    def _sort_dict_by_values(self, d, reverse):
        return sorted(d.items(), key=operator.itemgetter(1), reverse=True)

class CounterStat(Stat):
    """A stat that keeps a dictionary of key strings and counts"""
    def __init__(self, **options):
        super().__init__(**options)
        self._counter = defaultdict(int)

    @property
    def data(self):
        d = dict(self._counter)
        if(self._sort == 'incr'):
            d = self._sort_dict_by_values(d, reverse=True)
        elif(self._sort == 'decr'):
            d = self._sort_dict_by_values(d, reverse=False)
        return d
