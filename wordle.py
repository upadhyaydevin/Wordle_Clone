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
font = pygame.font.SysFont("Press Start 2P", 30)

running = True
rows, cols = 6, 5
starting_x, starting_y = 65, 65
cell_size = 50
padding = 5
grid_text = [["" for _ in range(cols)] for _ in range(rows)]
current_row, current_col = 0, 0
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            pass
        if event.type == pygame.KEYDOWN:
            # enter letter
            if event.unicode.isalpha() and len(grid_text[current_row][current_col])<1:
                grid_text[current_row][current_col] =  event.unicode.upper()
                current_col = (current_col + 1) % 5
                while event.key != pygame.K_RETURN: 
                    if current_col == 0:
                        current_row += 1
                        if current_row >= rows:
                            current_row = rows
                            current_col = 5

            # delete latest letter
            elif event.key == pygame.K_BACKSPACE:
                if current_col > 0 :
                    current_col -= 1        
                grid_text[current_row][current_col] = ""

    screen.fill((0,0,0))
    for row in range(rows):
        for col in range(cols):
            x = starting_x + col * (padding + cell_size)
            y = starting_y + row * (padding + cell_size)
            pygame.draw.rect(screen, (70,70,70), (x, y, cell_size, cell_size), border_radius=3)
            text_surface = font.render(grid_text[row][col], False, (255,255,255))
            text_rect = text_surface.get_rect(center=(x + cell_size / 2, y + cell_size / 2))
            screen.blit(text_surface, text_rect)
    pygame.display.flip()
    clock.tick(60)  # Limit to 60 FPS

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
