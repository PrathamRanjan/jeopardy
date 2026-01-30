from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time
import random

options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

BASE_URL = "http://localhost:5173"

def click_element(wait, xpath):
    el = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
    driver.execute_script("arguments[0].click();", el)
    time.sleep(0.5)

def run_test():
    try:
        print("🚀 Starting FULL Game Simulation...")
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 20)

        # Variables
        test_user = f"User_{random.randint(1000, 9999)}"
        test_pass = "pass"
        room_name = f"Room_{random.randint(1000, 9999)}"
        room_pass = "123"
        cat_name = f"Cat_{random.randint(100, 999)}"

        # --- STEP 1: CREATE CONTENT (Normal User) ---
        print(f"👤 Registering {test_user}...")
        click_element(wait, "//button[contains(text(), 'Register here')]" )
        
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='USERNAME']").send_keys(test_user)
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='PASSWORD']").send_keys(test_pass)
        click_element(wait, "//button[text()='Register']")
        
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            driver.switch_to.alert.accept()
        except: pass

        print("🔑 Logging in as Creator...")
        try:
            btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Have an account? Login')]" )
            if btn.is_displayed(): btn.click()
        except: pass

        driver.find_element(By.CSS_SELECTOR, "input[placeholder='USERNAME']").clear()
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='USERNAME']").send_keys(test_user)
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='PASSWORD']").clear()
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='PASSWORD']").send_keys(test_pass)
        click_element(wait, "//button[text()='Login']")

        print(f"wm Creating Room: {room_name}")
        click_element(wait, "//button[text()='Create Room']") # Toggle to create mode
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='ROOM NAME']").send_keys(room_name)
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='ROOM PASSWORD']").send_keys(room_pass)
        click_element(wait, "//button[text()='Create']")

        print("📝 Adding Category & Question...")
        click_element(wait, "//h2[contains(text(), 'Add Content')]/..") # Click parent button
        
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Category Name']")))
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='Category Name']").send_keys(cat_name)
        click_element(wait, "//button[text()='Add']")
        time.sleep(1) # Wait for DB

        driver.find_element(By.CSS_SELECTOR, "textarea[placeholder='Question...']").send_keys("What is this test?")
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='Answer...']").send_keys("Selenium")
        click_element(wait, "//button[contains(text(), 'SAVE TO DB')]" )
        
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            driver.switch_to.alert.accept()
            print("✅ Question Created.")
        except: pass

        print("👋 Logging out Creator...")
        click_element(wait, "//button[contains(text(), 'BACK TO DASHBOARD')]" )
        click_element(wait, "//button[contains(text(), 'Leave Room')]" )
        click_element(wait, "//button[contains(text(), 'Logout')]" )

        # --- STEP 2: PLAY GAME (Admin) ---
        print("👑 Logging in as Admin (Pratham)...")
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='USERNAME']" )))
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='USERNAME']").send_keys("Pratham")
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='PASSWORD']").send_keys("Pratham123")
        click_element(wait, "//button[text()='Login']")

        print(f"fw Joining Room: {room_name}")
        # Ensure Join mode
        try:
             click_element(wait, "//button[text()='Join Room' and contains(@class, 'text-blue-400')]" )
        except: pass 

        driver.find_element(By.CSS_SELECTOR, "input[placeholder='ROOM NAME']").send_keys(room_name)
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='ROOM PASSWORD']").send_keys(room_pass)
        click_element(wait, "//button[text()='Join']")

        print("⚙️  Entering Game Setup...")
        time.sleep(1)
        click_element(wait, "//h2[text()='Start Game']/parent::div/parent::button")

        print("ws Setting up Game...")
        # Add Player
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Player Name']")))
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='Player Name']").send_keys("TestPlayer")
        click_element(wait, "//button[text()='ADD']")
        
        # Select Category (The one we created)
        print(f"👉 Selecting Category: {cat_name}")
        cat_div = wait.until(EC.element_to_be_clickable((By.XPATH, f"//span[text()='{cat_name}']/parent::div")))
        driver.execute_script("arguments[0].click();", cat_div)
        
        # Start Game
        print("▶️  STARTING GAME!")
        click_element(wait, "//button[text()='Start Game']")

        # --- STEP 3: GAMEPLAY ---
        print("board Game Board Loaded. Clicking Question...")
        # Find the $100 question in our category column. 
        # Since we only selected 1 category, it's the first button.
        # Buttons usually have text '$100' inside
        time.sleep(2)
        question_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., '$100')]" )))
        driver.execute_script("arguments[0].click();", question_btn)

        print("❓ Question Active. Revealing Answer...")
        wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'What is this test?')]" )))
        click_element(wait, "//button[text()='SHOW ANSWER']")

        print("🏆 Awarding Points...")
        # Find player button. Text should contain "TestPlayer"
        click_element(wait, "//button[contains(text(), 'TestPlayer')]" )
        
        # Verify Score Updated
        # (Usually stays on question screen or goes back depending on logic. Logic says we stay on screen until closed?)
        # Logic says: awardPoints updates score but currentQuestionId becomes null -> so it SHOULD go back to board.
        
        print("🔙 Checking return to Board...")
        # If we are back at board, the question button should be disabled or gone, and score updated.
        # Let's check for the scoreboard at bottom
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), '$100')]" )))
        print("✅ Score updated to $100!")

        print("\n🎉🎉🎉 SUCCESS: FULL GAMEPLAY LOOP VERIFIED! 🎉🎉🎉")

    except Exception as e:
        print(f"\n❌ FAILED: {str(e)}")
        driver.save_screenshot("fail_full.png")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_test()