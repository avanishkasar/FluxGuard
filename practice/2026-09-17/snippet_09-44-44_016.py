# Practice commit 16
# Topic: reviewed two-pointer technique basics

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
