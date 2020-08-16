import glob

filename_list = glob.glob("*.mp4")
print(len(filename_list))

with open("video_name.txt", "w") as f:
    for name in filename_list:
        f.write("\"" + name + "\"\n")

print(filename_list)

# color
