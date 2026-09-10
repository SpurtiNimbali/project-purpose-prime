# Tummy copy audit

Edit any line after the `=` and send this file back. I will apply every change at once.

Rules while you edit:

- Keep each `KEY =` line. Change only the text after `=`.
- Do not delete keys you want to keep as-is.
- Use `{name}` placeholders as-is (they are filled by the app).
- Do not use em dashes.
- Phone model lists are omitted (data, not copy).

---

## Shared chrome

TAB_HOME = Home
TAB_LOG = Log
TAB_PROGRESS = Progress
TAB_PROFILE = Profile

BTN_ASK_TUMMY = Ask Tummy
MASCOT_ALT = Tummy the study mascot

WINDOW_RULE = Please don't eat or drink until the 3.5 hours after your chosen meal are up. If thirsty, you may have one cup of water, right after a recording.   

QUALITY_RULE = A usable recording matters more than a complete set. If you can't do this one properly, kindly skip it and tell us why.

SEVERITY_1 = Very mild
SEVERITY_2 = Mild
SEVERITY_3 = Moderate
SEVERITY_4 = Strong
SEVERITY_5 = Very strong

---



## Onboarding



### Welcome

WELCOME_TITLE = Tummy WELCOME_KICKER = Stanford School of Medicine WELCOME_BODY = Thank you for participating in our study. Let me walk you through the intial setup first!   

WELCOME_CTA = Get started 

### Subject ID

SID_TITLE = Subject ID  
SID_STEP = Step 1 of 9  
SID_BODY = Enter the ID the study coordinator assigned you. We store all your data under this ID only, never your name.  
SID_FIELD = Subject ID  
SID_PLACEHOLDER = STF-0000  
SID_CHECKING = Checking the study database…  
SID_OK_TITLE = ID confirmed  
SID_OK_BODY = Matched to cohort B, healthy group. Day 1 starts tomorrow morning.  
SID_BAD_TITLE = We can't find that ID  
SID_BAD_BODY = Check your Subject ID carefully and try again, or reach out to the study coordinator from Help.   

SID_CHECK = Check my ID  
SID_CONTINUE = Continue

### About you

ABOUT_TITLE = About you  
ABOUT_STEP = Step 2 of 9 ABOUT_SAY = Gut activity differs from person to person. If you are a female, the evening check-in will include one additional question related to your menstrual cycle.  
ABOUT_FEMALE = Female  
ABOUT_MALE = Male  
ABOUT_OTHER = Another description  
ABOUT_UNSAID = Prefer not to say  
ABOUT_WHY_TITLE = Why we ask  
ABOUT_WHY_BODY = Menstrual cycle timings can change gut symptoms, so this information helps the study team analyze your recordings with the appropriate context.  
ABOUT_CONTINUE = Continue

### Instruction video

VIDEO_TITLE = Instruction video  
VIDEO_STEP = Step 3 of 9  
VIDEO_PLAY = Play · 4 min  
VIDEO_AGAIN = Watch again  
VIDEO_BODY = This video covers how to position your phone on your body, the desired posture during recordings, and what a usable recording sounds like. A short quiz will follow this.  
VIDEO_NOTE_TITLE = Captions and transcript  
VIDEO_NOTE_BODY = If you'd rather read, open the transcript in the player. VIDEO_WAIT = Watch the video first  
VIDEO_CONTINUE = Continue to the quiz

### Attention check quiz

**QUIZ1_Q** = Where should the phone be placed during a recording?  
**QUIZ1_A** = On top of your shirt  
**QUIZ1_B** = Directly on bare skin, with the case off  
  
**QUIZ1_WHY** = A shirt or a phone case holds the microphone off your skin. Gut sounds are too quiet to carry across that gap.  


**QUIZ2_Q** = You drank coffee 20 minutes ago. Can you still do a fasting recording?  
**QUIZ2_A** = Yes, drinks are acceptable  
**QUIZ2_B** = No, even drinks are not permitted

  
**QUIZ2_WHY** = Coffee, food, or anything other than a sip of water changes your gut activity, so the recording wouldn't count as fasting.  


**QUIZ3_Q** = After your chosen meal, when do you record?  
**QUIZ3_A** = Once an hour, every hour, until bedtime   
**QUIZ3_B** = Right after eating, then every 30 minutes for 3.5 hours  
**QUIZ3_C** = Whenever you are available   
  
**QUIZ3_WHY** = Recording right after the meal and then every 30 minutes for 3.5 hours keeps the timing consistent across everyone in the study, so the data can be analyzed accurately.  
  
  
How a day works

DAY_TITLE = How a day works DAY_STEP = Step 5 of 9 DAY_SAY = Every study day follows the same schedule. Let me walk you through it, one step at a time.   
  
DAY_NEXT = Got it, next step DAY_CONTINUE = Continue

DAY1_T = 1 · Wake-up questions   
DAY1_B = Answer a short set of questions when you wake up: how you slept, and whether you've had anything to eat or drink.   
DAY2_T = 2 · Fasted recording   
DAY2_B = Record your gut sounds within 30 minutes of waking, before food, drink or moving about. Two minutes, sitting still.   
DAY3_T = 3 · Your study meal   
DAY3_B = Record just before you start eating, add a photo of the plate, then record when you take your last bite.  
DAY4_T = 4 · Recordings for 3.5 hours after   
DAY4_B = Record your gut sounds as soon as you finish eating, then another every 30 minutes for the following 3.5 hours.   
DAY5_T = 5 · No food or drink in that window   
DAY5_B = You should have nothing to eat or drink until that last recording. If you need water, one cup, right after a recording.   
DAY6_T = 6 · Quality matters more than quantity   
DAY6_B = If you can't record properly, skip it and tell us why. Missing one does not take you out of the study.   
DAY7_T = 7 · Log the rest of your day   
DAY7_B = For every other meal, snack, drink, gut symptom, physical activity, sleep or bowel movement - log it in the app.   
DAY8_T = 8 · Evening check-in   
DAY8_B = Answer a few questions before you go to bed.

### Daily schedule

SCHED_TITLE = Daily schedule
SCHED_STEP = Step 6 of 9
SCHED_SAY = When do you usually eat and sleep? Weekends are often different, so I'll ask for both.
SCHED_WEEKDAYS = Weekdays
SCHED_WEEKENDS = Weekends
SCHED_WAKE = Wake up
SCHED_BREAKFAST = Breakfast
SCHED_LUNCH = Lunch
SCHED_DINNER = Dinner
SCHED_BED = Go to bed
SCHED_FOOT = These times are only for reminders. 
SCHED_NEXT = Next: weekend times
SCHED_SAVE = Save my schedule

### Study meal pick

MEALPICK_TITLE = Your study meal   
MEALPICK_STEP = Step 6 of 9 MEALPICK_SAY = Choose the meal you eat at a steady time, around which you wish to do your recordings.   
MEALPICK_BF_WHEN = Recordings run through the morning   
MEALPICK_BF_WHY = Best if you work from home. A commute after breakfast usually breaks the 3.5-hour recording window.   
MEALPICK_LN_WHEN = Recordings run through the afternoon MEALPICK_LN_WHY = You'll need a private, quiet room, not a bathroom. Skip lunch if you have talking meetings in the 3.5 hours after.   
MEALPICK_DN_WHEN = Recordings run through the evening MEALPICK_DN_WHY = Only if you'll still be awake 3.5 hours later. For most people this is the easiest, because there are no office meetings to work around. MEALPICK_CONTINUE = Continue

### Snacking

SNACK_TITLE = Snacking
SNACK_STEP = Step 6 of 9
SNACK_SAY = Do you usually snack in between meals?
SNACK_YES = Yes, most days
SNACK_NO = No, rarely or never
SNACK_GUESS = A rough guess is fine. Add the times you usually snack on a typical {weekday|weekend}.
SNACK_N = Snack {n}
SNACK_ADD = + Add another snack time
SNACK_NEXT = Next: weekend snacks
SNACK_CONTINUE = Continue

### Technical setup

TECH_TITLE = Technical setup TECH_STEP = Step 7 of 9 TECH_BODY = Recordings use your phone's microphone. Telling us the model helps our study team analyze your recordings accurately.   
TECH_KIND = Which kind of phone do you have?   
TECH_APPLE = Apple   
TECH_ANDROID = Android   
TECH_MODEL = Phone model   
TECH_MODEL_HINT = Pick the closest match from the list. TECH_MODEL_PLACEHOLDER = Select your model   
TECH_CASE_TITLE = Case check   
TECH_CASE_BODY = The case must come off before every recording. Recordings done with the case on, severely detoriates the quality of the recordings.  
TECH_CASE_TICK = I can get my case off before each recording   
TECH_SAVE = Save setup

### Permissions

PERM_TITLE = Permissions
PERM_STEP = Step 8 of 9
PERM_PRIV_TITLE = Audio stays private
PERM_PRIV_BODY = Recordings are encrypted and labelled with your subject ID only. No one on the study team can link them back to you by name.
PERM_DND_TITLE = Do not disturb is only for recordings
PERM_DND_BODY = Do not disturb turns on when a recording starts and off the moment it ends. 
PERM_MIC = Microphone
PERM_MIC_SUB = So we can record your gut sounds
PERM_NOTIF = Reminders
PERM_NOTIF_SUB = For the fasted recording, your study meal, and each recording after it
PERM_DND = Do not disturb
PERM_DND_SUB = On only while you record
PERM_ALLOW = Allow
PERM_ALLOWED = Allowed
PERM_CONTINUE = Continue

### Practice recording

PRAC_TITLE = Practice recording   
PRAC_STEP = Step 9 of 9   
PRAC_H2 = Let's practice a recording   
PRAC_BODY = Find a quiet room and tap start when you're ready. Nothing from this run is uploaded.   
PRAC_START = Start   
PRAC_BANNER = Dry run    
PRAC_CASE_H2 = Take your phone case off   
PRAC_CASE_BODY = The bare phone sits on bare skin. A case leaves a gap the microphone can't hear through.   
PRAC_CASE_CTA = My case is off   
PRAC_POS_TITLE = Positioning guide   
PRAC_POS_STEP = Practice   
PRAC_POS_LINE = Bottom of the phone with the speakers on that spot, screen facing out.   
PRAC_POS_CTA = I'm in position   
PRAC_POS_HINT = Read each placement rule to continue.   
PRAC_STILL = Keep still until the timer ends   
PRAC_MARKS = {n} symptom mark / marks recorded   
PRAC_FINISH_EARLY = Finish early   
PRAC_COMPLETE = Practice complete  
PRAC_SEV_COACH = Now tell me how strong it feels, from 1 to 5. Tapping a number saves it and stamps the time. There's no extra save button. PRAC_SEV_GOTIT = Got it   
PRAC_COACH_DND = Do not disturb stays on until this recording ends, then it turns off on its own.   
PRAC_COACH_DND_CTA = Got it   
PRAC_COACH_TIMER = The number in the middle is time left. The ring fills as you record.   
PRAC_COACH_TIMER_CTA = Makes sense   
PRAC_COACH_SYM = If you feel something, tap an icon at the top. Try one now so you can see how it works.   
PRAC_COACH_SYM_CTA = Let me try   
PRAC_COACH_LEFT = Under 15 seconds left. When the ring fills, we'll save this and ask a few questions.   
PRAC_COACH_LEFT_CTA = Okay   
PRAC_SUCCESS_H2 = Successful session   
PRAC_SUCCESS_BODY = After a real recording you'll get this same sound check, then a few short questions.   
PRAC_SUCCESS_MARKS = You logged {n} symptom mark / marks. PRAC_SUCCESS_CTA = Continue

### You're all set

DONE_H1 = You're all set up
DONE_BODY = Day 1 starts tomorrow morning after you wake.
DONE_CTA = Go to home

---



## Positioning (shared by practice + real)

POS_TITLE = Positioning guide
POS_STEP = Placement
POS_LINE = Bottom of the phone with the speakers on that spot, screen facing out. 
POS_NEXT_RULE = Next rule · {n} of {total}
POS_IN_POSITION = I'm in position
POS_READ_HINT = Read each placement rule to continue.
POS_CHECK_N = Check {n} of {total}
POS_CHECK_CTA = Done, it's ready
POS_IMG_ALT = A seated participant holding a portrait phone against bare skin, 8 centimetres to their right and 3 centimetres below their belly button

POS_TIP1_T = Right lower belly POS_TIP1_B = 8 cm to the right of your belly button, then 3 cm down. POS_TIP2_T = Microphone edge down POS_TIP2_B = The bottom edge of the phone sits on that point. POS_TIP3_T = Same way every time POS_TIP3_B = Hold the phone upright, screen facing out, every session. POS_TIP4_T = Measure, don't guess POS_TIP4_B = Use the ruler app rather than guessing.

POS_CHK1_T = Quiet room
POS_CHK1_B = Turn off the TV, radio, and fans. Close the door if you can.
POS_CHK2_T = Sitting upright, no talking
POS_CHK2_B = Feet on the floor, breathe normally, and stay still.
POS_CHK3_T = Gentle pressure only
POS_CHK3_B = Just enough to keep contact. Pressing harder muffles the sound.

---



## Home

HOME_AM = Good morning HOME_PM = Good afternoon HOME_EVE = Good evening HOME_DAY = Day {n} of 7 HOME_NEXT_UP = Next up HOME_RAIL = Today's tasks HOME_RAIL_OPEN = Open HOME_SKIP = Skip this recording HOME_QUICK = Quick log HOME_MORE = More HOME_LOG_MEAL = Meal HOME_LOG_DRINK = Drink HOME_LOG_TOILET = Toilet HOME_LOG_SYMPTOM = Symptom

HOME_EXTRA_KICKER = Optional · anytime HOME_EXTRA_TITLE = Something feels different? HOME_EXTRA_BODY = Log an extra two-minute recording if you notice loud gurgles, pain, or a sudden change

HOME_FREEZE_KICKER = Freeze day
HOME_FREEZE_TITLE = Day {n} is paused
HOME_FREEZE_BODY = Nothing to record, log, or answer today. Your streak stays safe, and the schedule picks up again tomorrow morning.
HOME_FREEZE_RAIL = Today's rail · frozen
HOME_FREEZE_HOLD = All of today's sessions, meals and questions are on hold.
HOME_FREEZE_FOOT = Rest today. Everything reopens tomorrow morning with your fasted recording.

### Home next-up (generated from the plan)

NEXT_ALL_TAG = All done
NEXT_ALL_TITLE = Everything is done for today
NEXT_ALL_SUB = Nothing more until tomorrow morning.
NEXT_ALL_CTA = Open today's log

NEXT_WAIT_TAG = Waiting
NEXT_WAIT_SUB_UNTIL = You're free until {time}.
NEXT_WAIT_SUB_AROUND = Nothing due until around {time}.
NEXT_WAIT_CTA = Open today's plan

NEXT_REC_FASTED_TAG = Fasted recording
NEXT_REC_PRE_TAG = Pre-meal recording
NEXT_REC_POST_TAG = Post-meal recording
NEXT_REC_FASTED_SUB = Before food, drink, or moving around. Case off, quiet room, sit upright.
NEXT_REC_PRE_SUB = Record now, then start eating as soon as you finish.
NEXT_REC_POST_LATE = This recording is late. You can still do it now, or skip it and tell us why.
NEXT_REC_POST_SUB = Case off, quiet room, sit still. Two minutes is the minimum.
NEXT_REC_CTA = Start recording

NEXT_LOG_TAG = Meal logging
NEXT_LOG_SUB = Add a photo and the time. For a snack, a short description is enough.
NEXT_LOG_CTA = Log it now

NEXT_STUDY_START_SUB = Take a photo of the plate, then tap when you take the first bite.
NEXT_STUDY_END_TITLE = Finished eating?
NEXT_STUDY_END_SUB = Tap when your last bite is done. Every recording after that is timed from that moment.
NEXT_STUDY_START_CTA = Start the meal
NEXT_STUDY_END_CTA = I've finished eating

NEXT_Q_EVE_TAG = Evening check-in
NEXT_Q_AM_TAG = Wake-up questions
NEXT_Q_EVE_TITLE = A few questions about your day
NEXT_Q_AM_TITLE = A few questions before you record
NEXT_Q_EVE_SUB = What you ate, anything you missed, and how you felt. About three minutes.
NEXT_Q_AM_SUB = Sleep, anything you've eaten or drunk, bathroom, and activity since waking.
NEXT_Q_CTA = Answer questions

NEXT_FREEZE_TAG = Freeze day
NEXT_FREEZE_TITLE = Today is a freeze day
NEXT_FREEZE_SUB = Nothing to do today. The study picks up tomorrow.
NEXT_FREEZE_CTA = Open today's log

### Plan item labels

PLAN_Q_AM = Wake-up questions
PLAN_FASTED = Fasted morning recording
PLAN_PRE = Before {meal}
PLAN_MEAL_START = {Meal}, start eating
PLAN_MEAL_END = {Meal}, finished eating
PLAN_POST0 = Right after the meal
PLAN_POST_N = Meal + {offset}
PLAN_Q_EVE = Evening check-in
PLAN_LOG_MEAL = Log your {meal}
PLAN_SNACK_PM = Log your afternoon snack
PLAN_SNACK_EVE = Log your evening snack

---



## Today's plan (session hub)

HUB_TITLE = Today's plan
HUB_STEP = Day {n} of 7
HUB_CLOSING = Window closing
HUB_IN = In {until} · {time}
HUB_DUE = Due now · {time}
HUB_START_REC = Start this recording
HUB_START_MEAL = Log the meal and start eating
HUB_FINISH_MEAL = I've finished eating
HUB_ANSWER = Answer questions
HUB_SKIP_REC = Skip this one and tell us why
HUB_SKIP_MEAL = I skipped this meal
HUB_MISSED = Missed
HUB_DONE = Done
HUB_ALL_DONE = Everything for today is done. Nothing more until tomorrow morning.
HUB_EXTRA = Record an extra session

---



## Recording flow



### Before we start (case)

CASE_TITLE = Before we start
CASE_H2 = Take your phone case off
CASE_BODY = The bare phone sits against bare skin every time.
CASE_WHY = Why?
CASE_HIDE = Hide explanation
CASE_NOTE_TITLE = Why the case matters
CASE_NOTE_BODY = A case creates a gap between the microphone and your skin. Gut sounds are quiet and low, so even a couple of millimetres of air loses most of the signal.
CASE_CTA = My case is off

### Fasted check

FAST_TITLE = Fasted check
FAST_H2 = Still fasted, and within 30 minutes of waking?
FAST_BODY = Nothing except a few sips of water. Using the bathroom is fine. 
FAST_NOTE_TITLE = If either is a no
FAST_NOTE_BODY = Skip this morning's recording and tell us why. A gap is more useful than a recording we can't use.
FAST_YES = Yes, fasted and just woke up
FAST_NO = No, skip this one

### Which meal (legacy in-session picker)

WHICH_TITLE = Which meal?
WHICH_BODY = You'll use the same meal every study day. Pick the one you eat at a steady time.
WHICH_NOTE_TITLE = This can't change later
WHICH_NOTE_BODY = Every study day uses the same meal, so we can compare the recordings with each other.

### Study meal start

MEALSTART_TITLE = Start your {meal}
MEALSTART_STEP = Start of meal
MEALSTART_PHOTO = Photo of the plate
MEALSTART_PHOTO_N = {n} photo / photos added, add another
MEALSTART_HINT = Add another photo if one shot doesn't show the whole plate.
MEALSTART_FIELD = What's in it?
MEALSTART_FIELD_HINT = A line of text, or a voice note.
MEALSTART_PLACEHOLDER = Two eggs, toast, black coffee
MEALSTART_NOTE_TITLE = Timers start when you finish, not now
MEALSTART_NOTE_BODY = Tap below as you take the first bite. When you finish eating, tap I've finished. From that moment the app schedules a recording right away, then every 30 minutes for 3.5 hours.
MEALSTART_CTA = I'm starting to eat now

### Meal end

MEALEND_TITLE = Finished eating?
MEALEND_STEP = Timing anchor
MEALEND_H2 = Tap the moment your last bite is done
MEALEND_BODY = Every recording after this is timed from this moment.
MEALEND_NOTE_TITLE = From now until the last recording
MEALEND_CTA = I've finished eating, start the timers
MEALEND_HOME = Return to the home screen
MEALEND_FOOT = Still eating? Come back when the last bite is done.

### Quick check

CHECK_TITLE = Quick check
CHECK_PRE_TAG = Before the meal
CHECK_POST_TAG = After the meal
CHECK_PRE_H2 = Have you eaten anything before the upcoming meal?
CHECK_POST_H2 = Have you had anything at all since the meal?
CHECK_PRE_BODY = This recording has to happen immediately before the first bite.
CHECK_POST_BODY = No snacks. Water only if it was right after a recording, and at least 15 minutes ago.
CHECK_NOTE_TITLE = Quality over quantity
CHECK_PRE_YES = No, nothing yet
CHECK_POST_YES = Nothing since the meal
CHECK_PRE_NO = Yes, I already ate something
CHECK_POST_NO = I had a snack or a drink
CHECK_PRE_NO_B = Skip this recording and tell us what you had.
CHECK_POST_NO_B = We'll skip the rest of this window.
CHECK_CONTINUE = Continue →

### Live recording

REC_DND = Do not disturb is on. Stay on this screen.
REC_TAP = Feel something? Tap it, buttons are up here, away from the microphone.
REC_SYM_GURGLE = Gurgle
REC_SYM_BLOAT = Bloating
REC_SYM_PAIN = Pain
REC_SYM_CRAMP = Cramp
REC_SYM_NAUSEA = Nausea
REC_SYM_GAS = Gas
REC_UNTIL = until {n} min minimum
REC_SO_FAR = recorded so far
REC_STILL = Keep still until the ring fills
REC_PAST = Two minutes is done. Stay still a little longer if you can.
REC_MARKS = {n} symptom mark / marks recorded
REC_FINISH = Finish and check the audio
REC_KEEP_GOING = You can keep going. Longer recordings give us more to work with.
REC_STOP = Stop early
REC_CONFIRM_H = Are you sure? {n} seconds left
REC_CONFIRM_B = Two minutes is the minimum we can use. Stay still and I'll tell you when you're there.
REC_KEEP = Keep recording
REC_STOP_ANYWAY = Stop anyway
REC_SEV_HOW = At {mm:ss} · how strong is it?
REC_SEV_SAVE = Tap a number, it saves straight away.
REC_TOAST = {label} · {severity} saved

### Audio quality

QUAL_CHECK_H = Checking the audio…
QUAL_CHECK_B = We listen for background noise, rustling, and any gap between the phone and your skin.
QUAL_GOOD_H = Good quality recording
QUAL_GOOD_B = Clear contact, a quiet room, and gut sounds coming through. Nothing to redo.
QUAL_BAD_H = This one is too noisy to use
QUAL_BAD_B = We picked up rustling or background noise. Press the phone flat on bare skin, find a quieter spot, and try again. It only takes two minutes.
QUAL_REDO = Record it again
QUAL_KEEP = Keep it anyway
QUAL_CONTINUE = Continue

### Post-recording questions

POST_TITLE = Post-recording questions
POST_DONE_BOT = That's everything. Saving your session now.
POST_SEND = Send
POST_VOICE = Record a voice note instead
POST_NOTHING = Nothing to add
POST_PLACEHOLDER = Type your answer, or record it instead
POST_SCALE_LO = 1 = not at all
POST_SCALE_HI = 5 = fully
POST_FINISH = Finish session
POST_WATCH_TITLE = Please charge your smartwatch
POST_WATCH_BODY = Below 20% won't last the night, and sleep data matters a lot to us. Put it on the charger now and back on your wrist before bed.

POST_ORDINARY = Anything out of the ordinary during that recording? Noise, an interruption, a cough?
POST_ORDINARY_NO = No, it was clean
POST_ORDINARY_YES = Yes
POST_ORDINARY_MORE = What happened?
POST_WHERE = Where did you record?
POST_WHERE_MORE = Where was it?
POST_LOC_HOME = At home
POST_LOC_WORK = At work or in an office
POST_LOC_SCHOOL = School or campus
POST_LOC_OUT = Outside
POST_LOC_CAR = In a car
POST_LOC_OTHERHOME = Someone else's home
POST_LOC_OTHER = Other

POST_WATCH_Q = Are you wearing your smartwatch right now?
POST_WATCH_YES = Yes
POST_WATCH_CHARGE = No, it's charging
POST_WATCH_OTHER = No, another reason
POST_WATCH_MORE = What's going on with it?
POST_BATT_Q = How much battery does your smartwatch have?
POST_BATT_HI = Above 50%
POST_BATT_MID = 20 to 50%
POST_BATT_LO = Below 20%
POST_BATT_NS = Not sure

VS_BETTER = Better than usual
VS_SAME = Same as usual
VS_WORSE = Worse than usual

FAST_SLEEP_WHERE = Where did you sleep last night? FAST_SLEEP_BED = My own bed FAST_SLEEP_SHARED = A partner's or shared bed FAST_SLEEP_SOFA = A sofa or guest bed FAST_SLEEP_AWAY = Away from home, like a hotel FAST_SLEEP_OTHER = Other FAST_SLEEP_MORE = Where did you sleep? FAST_PHYS = How do you feel physically, compared with a usual morning? FAST_PHYS_MORE = What's different this morning? FAST_ENOUGH = Did you get enough sleep? FAST_ENOUGH_Y = Yes FAST_ENOUGH_N = No FAST_ENOUGH_NS = Not sure FAST_GI = Any gut symptoms this morning? FAST_GI_N = No FAST_GI_Y = Yes FAST_GI_MORE = Which ones, and how strong? FAST_WAKES = How many times did you wake during the night? FAST_WAKES_0 = None FAST_WAKES_1 = Once FAST_WAKES_2 = Twice FAST_WAKES_3 = Three times FAST_WAKES_4 = Four or more FAST_EMO = How do you feel emotionally, compared with a usual morning? FAST_EMO_MORE = What's different this morning? FAST_RESTED = How rested do you feel right now? FAST_UNUSUAL = Anything unusual about last night's sleep?

PRE_MEAL_NOW = Are you starting your meal right now, immediately after this recording?
PRE_MEAL_YES = Yes, eating now
PRE_MEAL_NO = No, not yet
PRE_PHYS = How do you feel physically, compared with usual?
PRE_HARD = Any strenuous activity in the last hour?
PRE_HARD_N = No
PRE_HARD_Y = Yes
PRE_HARD_MORE = What did you do?
PRE_EMO = How do you feel emotionally, compared with usual?
PRE_GI = Any gut symptoms since the last recording?
PRE_GI_N = No
PRE_GI_Y = Yes
PRE_GI_MORE = Which ones, and how strong?

POST_OUTSIDE = Since the last recording, did you have any symptoms outside a recording?
POST_OUTSIDE_N = No
POST_OUTSIDE_Y = Yes
POST_OUTSIDE_MORE = Which ones, and how strong?

### Snack skip

SNACKSKIP_TITLE = Something was eaten or drunk SNACKSKIP_SAY = Thank you for saying so. A gap is better than a recording we can't use. SNACKSKIP_FIELD = What did you have? SNACKSKIP_HINT = A rough description is fine: a bar, a coffee, juice. SNACKSKIP_PLACEHOLDER = Half a granola bar SNACKSKIP_NOTE_TITLE = What happens now SNACKSKIP_NOTE_BODY = Every remaining recording in this meal window will be skipped.  SNACKSKIP_LOGGED_TITLE = {n} recording / recordings skipped SNACKSKIP_LOGGED_BODY = Logged against today. Your next task is the evening check-in. Everything else carries on as normal tomorrow. SNACKSKIP_CTA = Log it and skip the rest SNACKSKIP_HOME = Back to home

### Skip reason

SKIP_TITLE = Skip this session SKIP_SAY = Skipping is the right call if you can't record properly. Tell us what got in the way. SKIP_PLACEHOLDER = Tell us in a few words SKIP_REPORT = Report this skip SKIP_BACK = Actually, I can record SKIP_PLACE1 = I didn't have a quiet, private place SKIP_PLACE3 = Something else SKIP_FAST1 = I ate or drank something other than water SKIP_FAST2 = More than 30 minutes have passed since I woke up SKIP_FAST3 = I drank water in the last 15 minutes SKIP_PRE1 = I'm not about to start eating SKIP_PRE2 = I already started eating SKIP_POST1 = I had a snack or a drink during the meal window SKIP_POST2 = I drank water in the last 15 minutes SKIP_EXTRA1 = I changed my mind

### Missed window popup

MISS_KICKER = Window closed
MISS_BODY = This recording was marked missed because the time passed. What got in the way?
MISS_PLACEHOLDER = Type it, or record a voice note
MISS_VOICE = Record a voice note
MISS_VOICE_SAVED = Voice note saved
MISS_SAVE = Save this note

### Extra recording

EXTRA_TITLE = Extra recording
EXTRA_KICKER = Optional · two minutes
EXTRA_Q = What made you want an extra recording?
EXTRA_R1 = Unusually loud or frequent sounds
EXTRA_R2 = Symptoms higher than normal
EXTRA_R3 = Both
EXTRA_R4 = Just curious
EXTRA_WHICH = Which symptom?
EXTRA_STRONG = How strong is it right now?
EXTRA_SCALE = 1 is very mild, 5 is very strong.
EXTRA_NOTE_TITLE = Same rules as always
EXTRA_NOTE_BODY = Case off, bare skin, quiet room, sit upright and still for two minutes.
EXTRA_CTA = Start the extra recording

### Session saved

SAVED_H1 = Session saved
SAVED_BODY = Uploaded, with {n} symptom mark / marks timestamped on the audio.
SAVED_NEXT_REC = Next recording
SAVED_NEXT_LOG = Next thing to log
SAVED_NEXT_MEAL = Your study meal
SAVED_NEXT_Q = Next questions
SAVED_ALL = All done for today
SAVED_TOMORROW = Tomorrow morning
SAVED_NONE = Nothing more until tomorrow morning's fasted recording.
SAVED_POST = Please don't eat or drink until the window is over. If you need water, one cup now.
SAVED_START = Take a photo of the plate, then tap when you take your first bite.
SAVED_END = Tap the moment your last bite is done. Every recording after that is timed from it.
SAVED_LOG = A photo and the time is all we need. For a snack, a short description is enough.
SAVED_WAIT = Nothing to do until then.
SAVED_CTA = Back to home

---



## Morning questions

AM_TITLE = Before your first recording
AM_INTRO = A few questions before your fasted recording. Try not to eat, drink, or move around until it's done.
AM_FINISH = Start the fasted recording
AM_THANKS = That's everything. Thank you.
AM_SAVE_TIME = Save this time
AM_SAVE_DUR = Save
AM_STRAIGHT = Straight away
AM_HOURS = Hours
AM_MINUTES = Minutes
AM_SEND = Send
AM_VOICE = Record a voice note instead
AM_NOTHING = Nothing to add
AM_PLACEHOLDER = Type it, or record it instead
AM_BRISTOL = Which Bristol type was it, 1 to 7?
AM_BRISTOL_SHOW = Check consistency descriptions
AM_BRISTOL_HIDE = Hide consistency descriptions
AM_BRISTOL_HINT = 1 is hard separate lumps, 7 is entirely liquid.
AM_SCALE_LO = 1 = none
AM_SCALE_HI = 5 = severe
AM_WATCH_NOTE_TITLE = Please charge your smartwatch now
AM_WATCH_NOTE_BODY = Put it on the charger now, and back on your wrist before you sleep. The overnight data matters a great deal to us.

AM_BED = What time did you get into bed last night? AM_LATENCY = How long did it take you to fall asleep? AM_LATENCY_HINT = A rough guess is fine. AM_WAKE = What time did you wake up? AM_INTAKE = Have you had anything to eat or drink yet this morning? AM_INTAKE_NONE = Nothing at all AM_INTAKE_WATER = A few sips of water AM_INTAKE_YES = Yes, something else AM_INTAKE_MORE = What was it, and roughly when? AM_INTAKE_WARN = This recording is meant to capture your gut before anything except water. Food or drink changes that activity. I'll still save what you had and when, so the team can read the audio in context. Record anyway, and please do not skip any meals because of this. Eat and log your meals as usual today. Try to stay fasted before tomorrow's recording. AM_OUT = What time did you get out of bed? AM_TOILET = Have you been to the toilet since waking? AM_TOILET_NO = No AM_TOILET_PEE = Yes, but no bowel movement AM_TOILET_BM = Yes, a bowel movement AM_ACT = Any physical activity since waking, other than going to the toilet? AM_ACT_N = No AM_ACT_Y = Yes AM_ACT_MORE = What did you do?

---



## Evening check-in

EVE_TITLE = Evening check-in
EVE_INTRO = Last thing for today. Honest gaps are more useful to the study than tidy guesses.
EVE_FINISH = Finish the day

EVE_LOGGED = Did you log everything you ate and drank today?
EVE_LOGGED_Y = Yes, all of it
EVE_LOGGED_N = No, some is missing
EVE_LOGGED_MORE = What's missing, and roughly when?
EVE_PHYS = How do you feel physically, compared with a usual evening?
EVE_MISS = Did you miss any recordings today?
EVE_MISS_N = No, I did them all
EVE_MISS_Y = Yes, one or more
EVE_MISS_MORE = Which ones, and what got in the way?
EVE_GI = Overall, how bad were your gut symptoms today?
EVE_GI_WORDS = In a few words, what were they like?
EVE_GI_HINT = For example: bloating was very bad, nothing else. Skip this if you had none.
EVE_EMO = How do you feel emotionally, compared with a usual evening?
EVE_UNUSUAL = Was today unusual in any way? An exam, a stressful event, an argument?
EVE_UNUSUAL_HINT = Only the study team sees this.
EVE_HARD = Was anything else about today hard to manage?
EVE_HARD_N = No, it went fine
EVE_HARD_Y = Yes
EVE_HARD_MORE = What made it hard?
EVE_ELSE = Anything else you'd like to tell us?
EVE_WATCH = Are you wearing your smartwatch right now?
EVE_BATT = How much battery does it have?

### Period check (after evening, if female)

PERIOD_SAY = Last question for today. Are you on your period right now?
PERIOD_Y = Yes
PERIOD_N = No
PERIOD_NS = Not sure
PERIOD_SKIP = Prefer not to say
PERIOD_WHY_TITLE = Why we ask
PERIOD_WHY_BODY = Cycle timing can change gut symptoms, so this helps the team read your recordings in context. It's stored against your subject ID only.

---



## Logging

LOG_H1 = Logging
LOG_COUNT_1 = 1 thing logged today. Add the rest whenever you remember.
LOG_COUNT_N = {n} things logged today. Add the rest whenever you remember.
LOG_TAB_ADD = Add an entry
LOG_TAB_TODAY = Today's log
LOG_HINT_TITLE = Or tell Tummy what happened
LOG_HINT_EX = "I had a coffee and a slice of toast"
LOG_MEALS = Meals
LOG_DRINKS = Drinks
LOG_SYMPTOMS = Symptoms
LOG_TIMELINE = Timeline
LOG_EMPTY = Nothing logged yet today.
LOG_PRIV_TITLE = Everything is saved against your subject ID
LOG_PRIV_BODY = You can add anything you forgot later in the day. Nothing locks.

LOG_TILE_MEAL = Meal or snack
LOG_TILE_MEAL_SUB = A photo, or a short description
LOG_TILE_DRINK = Drinks
LOG_TILE_DRINK_SUB = Water, tea, or anything fizzy
LOG_TILE_SYM = Symptom
LOG_TILE_SYM_SUB = What it is, and how strong
LOG_TILE_TOILET = Toilet habits
LOG_TILE_TOILET_SUB = When, and what it was like
LOG_TILE_SLEEP = Sleep
LOG_TILE_SLEEP_SUB = How last night went
LOG_TILE_ACT = Activity
LOG_TILE_ACT_SUB = Walks, workouts, or rest

### Log meal

LOGMEAL_TITLE = Log food or drink
LOGMEAL_PHOTO = Photo of what you had
LOGMEAL_PHOTO_N = {n} photo / photos, add another
LOGMEAL_HINT_SNACK = A photo is best. A short description is fine for a snack.
LOGMEAL_HINT_MEAL = Please add a photo for meals and drinks. Add another if one shot doesn't cover it.
LOGMEAL_TIME = What time was this?
LOGMEAL_WHAT = What was it?
LOGMEAL_BF = Breakfast
LOGMEAL_LN = Lunch
LOGMEAL_DN = Dinner
LOGMEAL_SN = Snack
LOGMEAL_DR = Drink
LOGMEAL_IN = What was in it?
LOGMEAL_IN_HINT = Type it out, or just say it out loud.
LOGMEAL_TYPE = Type it
LOGMEAL_REC = Record it
LOGMEAL_PLACEHOLDER = Chicken salad and a roll
LOGMEAL_HOLD = Hold to describe your meal
LOGMEAL_TRANSCRIBE = We transcribe it for you
LOGMEAL_SAVED = Voice note saved · 12 sec
LOGMEAL_AGAIN = Tap to record again
LOGMEAL_SAVE = Save to today's diary

### Log symptom

LOGSYM_TITLE = Log a symptom
LOGSYM_WHAT = What are you feeling?
LOGSYM_STRONG = How strong is it?
LOGSYM_SAVE = Save symptom
LOGSYM_GURGLE = Gurgling
LOGSYM_BLOAT = Bloating
LOGSYM_PAIN = Abdominal pain
LOGSYM_CRAMP = Cramping
LOGSYM_NAUS = Nausea
LOGSYM_GAS = Gas
LOGSYM_URG = Urgency

### Log sleep

LOGSLP_TITLE = Log sleep
LOGSLP_SAY = Three quick questions, then we're done.
LOGSLP_Q1 = How did you sleep last night?
LOGSLP_Q1A = Well
LOGSLP_Q1B = So-so
LOGSLP_Q1C = Badly
LOGSLP_Q2 = Roughly how many hours?
LOGSLP_Q2A = Under 5
LOGSLP_Q2B = 5 to 6
LOGSLP_Q2C = 6 to 7
LOGSLP_Q2D = 7 to 8
LOGSLP_Q2E = More than 8
LOGSLP_Q3 = Did you wake up during the night?
LOGSLP_Q3A = No
LOGSLP_Q3B = Once
LOGSLP_Q3C = A few times
LOGSLP_OK_TITLE = Sleep logged
LOGSLP_OK_BODY = Thanks, that helps us read this morning's fasting recording.
LOGSLP_DONE = Done

### Log activity

LOGACT_TITLE = Log activity
LOGACT_KIND = What kind of activity?
LOGACT_WALK = Walking
LOGACT_LIGHT = Light exercise
LOGACT_HARD = Hard exercise
LOGACT_SIT = Mostly sitting
LOGACT_LONG = For how long?
LOGACT_PLACEHOLDER = 30 minutes
LOGACT_SAVE = Save activity

### Log hydration

LOGH2O_TITLE = Log hydration
LOGH2O_GLASSES = Glasses today
LOGH2O_WHAT = What did you drink?
LOGH2O_WATER = Water
LOGH2O_TEA = Tea or coffee
LOGH2O_FIZZ = Carbonated drink
LOGH2O_OTHER = Other
LOGH2O_SAVE = Save hydration

### Log toilet

LOGTOI_TITLE = Log toilet habits
LOGTOI_PRIV_TITLE = Only your subject ID is attached
LOGTOI_PRIV_BODY = This is routine research data. Nothing here is shared with anyone outside the study team.
LOGTOI_WHEN = When was it?
LOGTOI_COUNT = Counted automatically from your logs
LOGTOI_CONS = Consistency
LOGTOI_CONS_HINT = 1 is hard and lumpy, 7 is entirely liquid.
LOGTOI_SHOW = Check consistency descriptions
LOGTOI_HIDE = Hide consistency descriptions
LOGTOI_URG = Was there any urgency?
LOGTOI_URG_Q = What does urgency mean?
LOGTOI_URG_INFO = Urgency is the feeling of needing to go right now, with little or no warning. "A little" means you could have waited a few minutes; "a lot" means you had to stop what you were doing and get to a toilet straight away.
LOGTOI_NO = No
LOGTOI_LITTLE = A little
LOGTOI_LOT = A lot
LOGTOI_SAVE = Save entry

---



## Progress

PROG_TITLE = Progress
PROG_DAY = Day {n} of 7
PROG_STREAK = Seven consecutive study days
PROG_FROZEN = Freeze day. Your streak stays safe until tomorrow.
PROG_TODAY = Today
PROG_RECS = {done} of {need} recordings · {min} min
PROG_MEALS = Meals
PROG_QS = Questions
PROG_FREEZE = Freeze day
PROG_FREEZE_USED = Freeze day used
PROG_FREEZE_NOW = Today is a freeze day
PROG_FREEZE_AVAIL = Pause one day if you need it. You get one, and it can't be undone.
PROG_FREEZE_USED_B = You've used your one freeze. The remaining days run back to back.
PROG_FREEZE_NOW_B = Paused until tomorrow. Nothing today counts as missed.
PROG_FREEZE_CTA = Use my freeze day
PROG_FREEZE_ASK = Use your only freeze day?
PROG_FREEZE_ASK_B = This pauses today. You get one freeze for the whole study, and it can't be undone.
PROG_FREEZE_YES = Yes, freeze today
PROG_FREEZE_NO = Keep going today

---



## Profile

PROF_TITLE = Profile
PROF_WHO = Participant STF-0142
PROF_DAY = Day {n} of 7
PROF_ID = Subject ID
PROF_ID_SUB = STF-0142 · cohort B
PROF_TIMES = Daily times
PROF_TIMES_SUB = Meals, sleep and wake
PROF_TECH = Technical Setup
PROF_TECH_SUB = iPhone 14 · bottom microphone
PROF_GUIDE = Setup guide
PROF_GUIDE_SUB = Rewatch the instruction video
PROF_PRIV_TITLE = Your data is anonymous
PROF_PRIV_BODY = Recordings and logs are stored against your subject ID. Message your coordinator if you have questions.
PROF_CONTACT = Contact the study team
PROF_CONTACT_SUB = Questions, a missed session, or a concern
PROF_RESTART = Restart the walkthrough

---



## Contact

CONTACT_TITLE = Contact the study team
CONTACT_SAY = What's going on? I'll point you to the right place.
CONTACT_ASK = Ask me first
CONTACT_ASK_B = Missed recordings, timings, reminders, or trouble with the app.
CONTACT_ASK_CTA = Open chat
CONTACT_COORD = Message your study coordinator
CONTACT_COORD_B = Scheduling, compensation, or taking part. They reply within one working day.
CONTACT_COORD_CTA = Write a message
CONTACT_CONCERN = Raise a concern or complaint
CONTACT_CONCERN_B = Your concerns will be addressed directly by the study coordinator.
CONTACT_CONCERN_CTA = Write or record
CONTACT_NOTE_TITLE = Prefer to talk it through?
CONTACT_NOTE_BODY = Send a message any time. Your coordinator replies on weekdays, 9am to 5pm.

FORM_TITLE = Send a message
FORM_ABOUT = What's it about?
FORM_T1 = Scheduling or timings
FORM_T2 = The app isn't working
FORM_T3 = Compensation
FORM_T5 = I'd like to pause or stop taking part
COMPLAINT_TITLE = Raise a concern or complaint
COMPLAINT_SAY = Write it in your own words, or record a voice note. This goes straight to the study coordinator.
COMPLAINT_LABEL = What's going on?
COMPLAINT_HINT = Type it out, or just say it out loud.
COMPLAINT_TYPE = Type it
COMPLAINT_VOICE = Record it
COMPLAINT_PLACEHOLDER = Tell us what happened, in your own words.
COMPLAINT_HOLD = Hold to record your concern
COMPLAINT_SAVED = Voice note saved · 12 sec
COMPLAINT_SEND = Send to the study coordinator
COMPLAINT_SENT = Sent. The study coordinator will address this directly.
FORM_MORE = Tell us a bit more
FORM_MORE_HINT = A sentence or two is plenty.
FORM_PLACEHOLDER = What happened, and what would help?
FORM_QUICK_TITLE = Want a quicker answer?
FORM_QUICK_BODY = Ask Tummy in the chat. Timing and app questions are usually answered instantly.
FORM_SEND = Send to the study team
FORM_SENT = Sent. Someone on the team will reply within one working day.
FORM_WAIT_TITLE = Nothing changes in the meantime
FORM_WAIT_BODY = Keep recording as usual. If you need to pause, say so and the team will arrange it with you.
FORM_HOME = Back to home

---



## Ask Tummy (chat)

CHAT_NAME = Ask Tummy
CHAT_SUB = I'll log what you tell me
CHAT_HELLO = Hi, I'm Tummy. Tell me what you ate, drank, or felt, and I'll log it for you.
CHAT_PLACEHOLDER = I just had a banana…
CHAT_CHIP1 = I just had a protein bar
CHAT_CHIP2 = I drank a glass of water
CHAT_CHIP3 = Bloating, quite bad
CHAT_CHIP4 = I went to the toilet
CHAT_CHIP5 = What's next?
CHAT_FALLBACK = Try it in plain words, like "I had a protein bar" or "bloating, quite bad". I'll log it straight away.
CHAT_POS = Case off, bare skin, 8 cm to the right and 3 cm down from your belly button. Sit still for two minutes.
CHAT_REC = I can't start a recording from here. Take your case off, find somewhere quiet, and I'll run the two minutes with you.
CHAT_REC_CTA = Start recording
CHAT_SEE_LOG = See today's log
CHAT_ADJ = Adjust this symptom