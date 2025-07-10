// Oke Daniel - MergeFund project - Challenge
// File: merge_project.cpp
// Purpose: Prints "Hello, MergeFund" with a random emoji.
// Author: Oke Daniel
// Date: 2025-07-09

#include <iostream>
#include <cstdlib>                                                              // For rand() and srand()
#include <ctime>                                                                // For time() to seed the random number generator
#include <string>                                                               // For using strings

using namespace std;

// Function to return a random emoji from the list
string randomEmoji()
{
    const string emojis[] = {"🚀", "💼", "✨", "🔥", "🎯", "🌟", "💡", "📈"};
    return emojis[rand() % 8];                                                  // return random emoji index from 0 to 7
}

// main function
int main()
{
    srand((unsigned)time(0));                                                   // Seed the random number generator with the current time
    cout << "Hello, MergeFund " << randomEmoji() << endl;                       // Print a greeting with a random emoji
    return 0;
}