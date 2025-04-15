from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
time.sleep(30)

# User credentials
users = [
    # {"email": "admin@gmail.com", "password": "admin"},
    {"email": "clinic_admin0@example.com", "password": "cli"},
    {"email": "lab_technician0@example.com", "password": "tech"},
    {"email": "la@e.com", "password": "la"},
    {"email": "doctor0@example.com", "password": "doc"},
    {"email": "patient0@example.com", "password": "pat"}
]

# Set the Nailysis frontend login page URL
LOGIN_URL = "http://localhost:5173/login"  # Change if deployed

# Function to log in each user
def login_user(email, password):
    driver = webdriver.Chrome()  # Open a new browser window
    driver.get(LOGIN_URL)  # Navigate to login page
    time.sleep(2)  # Wait for page to load

    try:
        # Find and fill email input
        email_input = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div[2]/section/form/div[1]/input')
        email_input.send_keys(email)

        # Find and fill password input
        password_input = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div[2]/section/form/div[2]/input')
        password_input.send_keys(password)

        # Click the login button
        password_input.send_keys(Keys.RETURN)
        
        print(f"Logged in: {email}")

    except Exception as e:
        print(f"Error logging in {email}: {e}")

    return driver

# Open multiple logins in separate browser windows
drivers = [login_user(user["email"], user["password"]) for user in users]


# Keep the script running to prevent browsers from closing
value = 0
while value == 0:
    value = int(input("Type 1 to stop and 0 to continue..."))
    


# Uncomment to close all windows when you're done
# for driver in drivers:
#     driver.quit()
