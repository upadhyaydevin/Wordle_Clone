from termcolor import colored
import random

# Initialize the game
def read_random_word():
    with open("words.txt") as f:
        word_array = f.read().splitlines()
        return random.choice(word_array)
play = True
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
