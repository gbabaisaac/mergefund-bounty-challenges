#!/usr/bin/env python3
"""
MergeFund Word Quest - Interactive Terminal Game
Challenge: Creative "Hello MergeFund" Implementation

A fun maze-like game where players collect letters to spell "HELLO MERGEFUND"
Features: ASCII art, animations, color output, and interactive gameplay
"""

import random
import time
import sys
import os
from typing import List, Tuple, Dict

class MergeFundQuest:
    def __init__(self):
        self.width = 20
        self.height = 15
        self.player_pos = [1, 1]
        self.target_word = "HELLO MERGEFUND"
        self.collected_letters = []
        self.letters_positions = {}
        self.game_board = []
        self.initialize_game()
    
    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def initialize_game(self):
        # Create game board with walls (█) and empty spaces ( )
        self.game_board = [['█' for _ in range(self.width)] for _ in range(self.height)]
        
        # Create paths
        for y in range(1, self.height - 1, 2):
            for x in range(1, self.width - 1, 2):
                self.game_board[y][x] = ' '
                # Create random connections between cells
                if x < self.width - 2 and random.random() > 0.3:
                    self.game_board[y][x + 1] = ' '
                if y < self.height - 2 and random.random() > 0.3:
                    self.game_board[y + 1][x] = ' '
        
        # Place letters randomly on empty spaces
        available_positions = []
        for y in range(self.height):
            for x in range(self.width):
                if self.game_board[y][x] == ' ' and (x, y) != (1, 1):
                    available_positions.append((x, y))
        
        # Remove spaces from target word and place letters
        letters_to_place = self.target_word.replace(' ', '')
        random.shuffle(available_positions)
        
        for i, letter in enumerate(letters_to_place):
            if i < len(available_positions):
                pos = available_positions[i]
                self.letters_positions[pos] = letter
    
    def print_colored_text(self, text: str, color_code: str):
        print(f"\033[{color_code}m{text}\033[0m", end='')
    
    def draw_board(self):
        self.clear_screen()
        
        # Game title with animation
        title = "🎮 MERGEFUND WORD QUEST 🎮"
        self.print_colored_text(f"\n{title.center(50)}\n", "1;36")  # Bright cyan
        
        # Progress indicator
        progress = f"Collected: {''.join(self.collected_letters)} ({len(self.collected_letters)}/{len(self.target_word.replace(' ', ''))})"
        self.print_colored_text(f"{progress.center(50)}\n", "1;33")  # Bright yellow
        
        print("=" * 50)
        
        # Draw the game board
        for y in range(self.height):
            for x in range(self.width):
                if [x, y] == self.player_pos:
                    self.print_colored_text("@", "1;32")  # Bright green player
                elif (x, y) in self.letters_positions:
                    letter = self.letters_positions[(x, y)]
                    self.print_colored_text(letter, "1;31")  # Bright red letters
                elif self.game_board[y][x] == '█':
                    self.print_colored_text("█", "37")  # White walls
                else:
                    print(" ", end='')
            print()
        
        print("=" * 50)
        print("Controls: W(up) A(left) S(down) D(right) Q(quit)")
        print("Collect all letters to reveal the secret message!")
    
    def move_player(self, direction: str):
        new_x, new_y = self.player_pos[0], self.player_pos[1]
        
        if direction.lower() == 'w':
            new_y -= 1
        elif direction.lower() == 's':
            new_y += 1
        elif direction.lower() == 'a':
            new_x -= 1
        elif direction.lower() == 'd':
            new_x += 1
        
        # Check bounds and walls
        if (0 <= new_x < self.width and 0 <= new_y < self.height and 
            self.game_board[new_y][new_x] != '█'):
            self.player_pos = [new_x, new_y]
            
            # Check if player collected a letter
            pos_tuple = (new_x, new_y)
            if pos_tuple in self.letters_positions:
                letter = self.letters_positions[pos_tuple]
                self.collected_letters.append(letter)
                del self.letters_positions[pos_tuple]
                
                # Add some excitement for letter collection
                self.print_colored_text(f"\n🎉 Collected letter '{letter}'! 🎉\n", "1;35")
                time.sleep(0.5)
    
    def display_victory_animation(self):
        self.clear_screen()
        
        # ASCII art celebration
        celebration_art = [
            "  🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉",
            "  🎊         CONGRATULATIONS!        🎊",
            "  🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉",
        ]
        
        for line in celebration_art:
            self.print_colored_text(f"{line.center(60)}\n", "1;33")
            time.sleep(0.3)
        
        print("\n")
        
        # Animated "Hello MergeFund" reveal
        message = "HELLO MERGEFUND"
        colors = ["1;31", "1;32", "1;33", "1;34", "1;35", "1;36"]
        
        for i in range(3):  # Animate 3 times
            print(" " * 20, end='')
            for j, char in enumerate(message):
                color = colors[j % len(colors)]
                self.print_colored_text(f"{char}", color)
                time.sleep(0.1)
            print("\n")
            time.sleep(0.5)
        
        # Final message
        final_messages = [
            "\n🚀 You've successfully completed the MergeFund Quest! 🚀",
            "💰 Welcome to the MergeFund ecosystem! 💰",
            "🏆 Thanks for playing this creative challenge! 🏆\n"
        ]
        
        for msg in final_messages:
            self.print_colored_text(f"{msg.center(70)}\n", "1;36")
            time.sleep(1)
    
    def get_input(self):
        try:
            # Try to use getch for immediate input
            import msvcrt
            return msvcrt.getch().decode('utf-8')
        except ImportError:
            try:
                import termios, tty
                fd = sys.stdin.fileno()
                old_settings = termios.tcgetattr(fd)
                tty.raw(sys.stdin.fileno())
                char = sys.stdin.read(1)
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
                return char
            except:
                # Fallback to regular input
                return input().strip()
    
    def play(self):
        self.print_colored_text("\n🎮 Welcome to MergeFund Word Quest! 🎮\n", "1;36")
        print("Collect all the letters scattered around the maze...")
        print("Use WASD to move, Q to quit. Press any key to start!")
        input()
        
        while True:
            self.draw_board()
            
            # Check win condition
            if len(self.collected_letters) == len(self.target_word.replace(' ', '')):
                self.display_victory_animation()
                break
            
            try:
                move = self.get_input()
                if move.lower() == 'q':
                    print("\nThanks for playing! 👋")
                    break
                elif move.lower() in ['w', 'a', 's', 'd']:
                    self.move_player(move)
            except KeyboardInterrupt:
                print("\n\nGame interrupted. Thanks for playing! 👋")
                break
            except:
                # Handle any input errors gracefully
                continue

def main():
    """
    Main entry point for the MergeFund Word Quest game.
    
    This creative implementation of "Hello MergeFund" combines:
    - Interactive gameplay
    - ASCII art and animations
    - Colorful terminal output
    - Letter collection mechanics
    - Victory celebration
    
    The game demonstrates technical skills while being fun and engaging!
    """
    print("Initializing MergeFund Word Quest...")
    time.sleep(1)
    
    game = MergeFundQuest()
    game.play()
    
    print("\n🌟 Visit mergefund.org to learn more! 🌟")

if __name__ == "__main__":
    main()