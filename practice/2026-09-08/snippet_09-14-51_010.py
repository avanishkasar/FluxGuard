# Practice commit 10
# Topic: practiced reading LeetCode problem statements

stk = []
for ch in '({[]})':
    if ch in '({[': stk.append(ch)
    else: stk.pop() if stk else None
print(not stk)
