# Practice commit 1
# Topic: revised loop logic: for vs while differences

s = 'hello world'
count = sum(1 for c in s.lower() if c in 'aeiou')
print(count)
