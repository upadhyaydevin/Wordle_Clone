from termcolor import colored
import random
import pygame
import sys
# Initialize the game
def read_random_word():
    with open("words.txt") as f:
        word_array = f.read().splitlines()
        return random.choice(word_array)
play = True
pygame.init()
clock = pygame.time.Clock()
screen = pygame.display.set_mode((400, 600))
pygame.display.set_caption("Wordle")

running = True
rows, cols = 6, 5
starting_x, starting_y = 65,30
cell_size = 50
padding = 5

while running:
    # poll for events
    # pygame.QUIT event means the user clicked X to close your window
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            pass
    screen.fill((0,0,0))
    for row in range(rows):
        for col in range(cols):
            x = starting_x + col * (padding + cell_size)
            y = starting_y + row * (padding + cell_size)
            pygame.draw.rect(screen, (70,70,70), (x, y, cell_size, cell_size), border_radius=3)
    
    pygame.display.flip()
    clock.tick(60)  # Limit to 60 FPS
# implement UI
# handle duplicates


# Main game loop
while play:
    word = read_random_word()
    print(word)  # for debugging
    for attempt in range(1, 7):
        guess = input("Enter your guess: ").lower()
        
        # Validate input length
        while len(guess) != 5:
            print("Please enter a 5-letter word: ")
            guess = input().lower()
        
        result = ""
        for i in range(len(guess)):
            if guess[i] == word[i]:
                result += colored(guess[i], 'green')
            elif guess[i] in word:
                result += colored(guess[i], 'yellow')
            else:
                result += guess[i]
        
        print(result)
        
        if guess == word:
            print(f"Correct! You got it in {attempt} attempts.")
            break
        
        if attempt == 6:
            print(f"Sorry, the Wordle was {word}")
    
    # Ask if the player wants to play again
    play_again = input("Do you want to play again? (press q to quit) ").lower()
    if play_again == "q":
        play = False 
    
# implement UI
# handle duplicates
