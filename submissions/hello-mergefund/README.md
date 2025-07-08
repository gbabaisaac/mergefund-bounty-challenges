# MergeFund ASCII Art Generator

A simple Python script that generates beautiful ASCII art with decorative star borders for the "Hello MergeFund" message.

## Features

- Clean, large ASCII text using the 'big' font
- Colorful cyan output
- Decorative star emoji borders
- Centered text alignment

## Prerequisites

- Python 3.6 or higher
- pip (Python package installer)

## Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   ```

2. **Install required dependencies**
   ```bash
   pip install pyfiglet termcolor
   ```

   Or if you prefer using a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install pyfiglet termcolor
   ```

## Usage

Simply run the script:

```bash
python main.py
```

The script will output a colorful ASCII art banner with "Hello MergeFund" surrounded by decorative stars.

## Dependencies

- **pyfiglet**: For generating ASCII art text
- **termcolor**: For adding color to terminal output

## Customization

You can easily modify the script to:
- Change the text by updating the `text` variable
- Use different fonts by changing the `font` parameter in `Figlet(font='big')`
- Modify colors by changing the color parameter in `colored(final_output, 'cyan')`
- Adjust the border style by changing the `✨` emoji to other characters

## Code Approach

I wanted to create something that looked polished and eye-catching, so here's how I tackled it:

**Text Generation**: Started with pyfiglet's 'big' font because it's clean, readable, and has that satisfying retro terminal feel. Sometimes the simple choices are the best ones.

**Width Calculation**: This was the trickiest part - I had to measure every line of the ASCII art to find the widest one. The reason? I wanted those star borders to line up perfectly, regardless of how the text flows across multiple lines.

**Centering Everything**: Nothing looks worse than lopsided text, so I made sure every line gets centered within the maximum width. It's a small detail that makes a huge difference in the final appearance.

**Dynamic Borders**: The star borders automatically scale with whatever text you throw at it. Top, bottom, and sides all get the same treatment, so the whole thing stays consistent and balanced.

**Color Choice**: Added cyan because it gives that nice terminal aesthetic without being too flashy. Plus, colored output just feels more professional than plain white text.

The whole approach is designed to be flexible - you can change the text to anything and it'll still come out looking clean and properly formatted.
