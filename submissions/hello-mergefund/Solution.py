from pyfiglet import Figlet
from termcolor import colored

figlet = Figlet(font='big')  # Clean, large, readable font
text = "Hello MergeFund"

ascii_art = figlet.renderText(text)
lines = ascii_art.split('\n')

# Determine max width for consistent star border
max_width = max(len(line) for line in lines)
star_border = '✨' * ((max_width // 2) + 4)

# Center each line for neatness
centered_lines = [line.center(max_width) for line in lines]

# Build final output with stars
final_output = (
    f"{star_border}\n"
    + '\n'.join(f"✨ {line} ✨" for line in centered_lines)
    + f"\n{star_border}"
)

print(colored(final_output, 'cyan'))
