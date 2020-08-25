import csv
import pandas as pd
import ast


def transform_data():
    f1 = pd.read_csv('trialdata.csv')

    tf = f1.pivot(index='Index', columns='Name', values='Data')
    tf.to_csv('trialdata_t.csv')


#get approve_workers and reject_workers lists
f2 = pd.read_csv('trialdata_t.csv')
f2 = f2.drop(['Index'], axis=1)
reject_worker_id = []
approve_worker_id = []
def manage_workers(col): 
    for i in col: 
        if not (pd.isnull(i)): 
            r = ast.literal_eval(i)
            check = r.get('phase')
            answer = r.get('answer')
            last_r = pd.Series.last_valid_index(col)
            worker_id = ast.literal_eval(col[last_r])
            worker_id = worker_id.get('worker_id')
            if (check == 'attention_check'):
                if (answer == 'red'):
                    approve_worker_id.append(worker_id)
                else: 
                    reject_worker_id.append(worker_id)

#output workers lists
def get_worker_list():  
    for col in f2: 
        manage_workers(f2[col])

    reject_workers = pd.DataFrame(reject_worker_id, columns=["reject_workers"])
    reject_workers.to_csv('reject_workers.csv')

    approve_workers = pd.DataFrame(approve_worker_id, columns=["reject_workers"])
    approve_workers.to_csv('approve_workers.csv')



#clean the data; somehow this does NOT work at all 
f3 = pd.read_csv('trialdata_t.csv')
f3 = f3.drop(['Index'], axis=1)
def clean_data():
    for c in f3: 
        idx = 0
        for r in f3[c]: 
            #print (f3[c][idx])
            if not (pd.isnull(r)) and ('positivity' in r):
                break
            else: 
                f3.drop([idx], axis=0)
            idx = idx+1

    clean_data()
    f3.to_csv('clean_data.csv')



#organize data
df = pd.read_csv('clean_data.csv')
df = df.drop(['Index'], axis=1)
animations = []
anim_name = ['green_blink.mp4', 'blue_blink.mp4', 'white_blink.mp4', 'yellow_blink.mp4', 'red_blink.mp4', 'head_up_yellow.mp4', 'head_up_red.mp4', 'head_up_green.mp4', 'head_up_blue.mp4', 'head_up_white.mp4', 'neutral_eyes_open.mp4', 'neutral_eyes_close.mp4', 'double_blink.mp4', 'putdown_sounds_on.mp4', 'pickup_sounds_on.mp4', 'gotit_docked_sounds_on.mp4', 'proud_1_sounds_on.mp4', 'tickle_sounds_on.mp4', 'giggle_3_sounds_on.mp4', 'no_2_sounds_on.mp4', 'live_frown.mp4', 'thank_you_1_sounds_on.mp4', 'yes_sounds_on.mp4', 'twitch_1_sounds_on.mp4', 'huh2_sounds_on.mp4', 'bye_1_sounds_on.mp4', 'photo_shoot_1_docked.mp4', 'huh1_offline_docked_sounds_on.mp4', 'ponder_sad.mp4', 'lost_sounds_on.mp4', 'pay_attention_0times.mp4', 'pay_attention_2times.mp4', 'pay_attention_4times.mp4']
    
def get_metrics(col, anim_name):
    anim = []
    for e in anim_name: 
        for row in col: 
            if not (pd.isnull(row)): 
                r = ast.literal_eval(row)
                anim_single = r.get('phase')
                p = r.get('positivity')
                s = r.get('socialness')
                i = r.get('intensity')
                if (anim_single == e): 
                    anim.append([p,s,i])
    animations.append(anim)                
            
def calculator():
    for c in df: 
         get_metrics(df[c], anim_name)

    animation_list= pd.DataFrame(animations, columns=anim_name)
    animation_list.to_csv('animations.csv')

#get the average
metrics = ['positivity', 'socialness', 'intensity']
df2 = pd.read_csv('animations.csv')
df2 = df.drop(['Index'], axis=1)
metric = []

def calculate_avg():
    for c in df2: 
        positivity = 0
        socialness = 0
        intensity = 0
        for r in df2[c]: 
            m = ast.literal_eval(r)
            positivity += float(m[0])
            socialness += float(m[1])
            intensity += float(m[2])
        positivity /= 98
        socialness /= 98
        intensity /= 98
        metric.append([positivity,socialness,intensity])

    metric_list= pd.DataFrame(metric, columns=metrics, index=anim_name)
    metric_list.to_csv('animations_avg.csv')

calculate_avg()