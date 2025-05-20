import kaggle
import os
import glob
import pandas as pd

# Download dataset to current directory
download_dir = os.getcwd()
kaggle.api.dataset_download_files('audreyhengruizhang/china-city-attraction-details', 
                                   path=download_dir, unzip=True)

def process_csv(file):
    df = pd.read_csv(file)
    df['评分'] = df['评分'].replace(["--", "0.0"], pd.NA)
    df.drop(columns=["链接","地址","开放时间","图片链接","评分","门票","Page"], errors="ignore", inplace=True)
    df.to_csv(file, index=False)    # write to .csv file
    
# pre-process dataset
csv_dir = glob.glob(f"citydata/*.csv")
for csv_file in csv_dir: 
    process_csv(csv_file)
