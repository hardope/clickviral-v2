def solve(inp):
     val = inp.split(" ")
     if len(val) != 3:
          print("Invalid expression")
          return

     try:
          val[0] = float(val[0])
          val[2] = float(val[2])
     except ValueError:
          print("Invalid expression")
          return

     if val[1] == "+":
          print(f"{val[0]} + {val[2]} = {val[0] + val[2]}\n")
     elif val[1] == "-":
          print(f"{val[0]} - {val[2]} = {val[0] - val[2]}\n")
     elif val[1] == "*":
          print(f"{val[0]} * {val[2]} = {val[0] * val[2]}\n")
     elif val[1] == "/":
          print(f"{val[0]} / {val[2]} = {val[0] / val[2]}\n")

def main():
     while True:
          val = input("Expression: ")
          if val == "exit":
               break
          else:
               solve(val)

if __name__ == "__main__":
     main()