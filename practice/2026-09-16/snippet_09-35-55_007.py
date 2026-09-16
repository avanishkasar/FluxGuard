# Practice commit 7
# Topic: revised recursion: base case and recursive case

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
