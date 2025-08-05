from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time
import os

# User credentials
users = [
    {"email": "clinic_admin@example.com", "password": "cli"},
    {"email": "labtech0@example.com", "password": "tech"},
    {"email": "lab_admin@example.com", "password": "lab"},
    {"email": "doctor0@example.com", "password": "doc"},
    {"email": "patient0@example.com", "password": "pat"},
    # {"email": "patient1@example.com", "password": "pat"},
    # {"email": "patient2@example.com", "password": "pat"},
    # {"email": "patient3@example.com", "password": "pat"},
]

# Set the Nailysis frontend login page URL
LOGIN_URL = "http://localhost:5173/login"

# Function to log in each user
def login_user(email, password, index):
    options = Options()
    # Create a unique user data dir per instance
    profile_path = os.path.abspath(f"./tmp/profile_{index}")
    options.add_argument(f"--user-data-dir={profile_path}")
    options.add_argument("--disable-extensions")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    driver.get(LOGIN_URL)
    time.sleep(2)

    try:
        email_input = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div[2]/section/form/div[1]/input')
        email_input.send_keys(email)

        password_input = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div[2]/section/form/div[2]/input')
        password_input.send_keys(password)
        password_input.send_keys(Keys.RETURN)

        print(f"Logged in: {email}")
    except Exception as e:
        print(f"Error logging in {email}: {e}")

    return driver

# Open multiple logins in separate browser windows
drivers = [login_user(user["email"], user["password"], i) for i, user in enumerate(users)]

# Keep the script running
value = 0
while True:
    user_input = input("Type 1 to stop and 0 to continue...").strip()
    if user_input in ['0', '1']:
        value = int(user_input)
        if value == 1:
            break
    else:
        print("Invalid input. Please type 0 or 1.")


# Close all windows when you're done
# for driver in drivers:
#     driver.quit()
