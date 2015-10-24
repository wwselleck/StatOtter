def dictionary_to_table(d, header1, header2):
    result = '{:s}|{:s}\n:--|:--\n'.format(header1, header2)
    for (k,v) in d:
        result += '{0}|{1}\n'.format(k, v)
    return result
