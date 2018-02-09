import boto3

s3 = boto3.client('s3')

keys = []
resp = s3.list_objects_v2(Bucket='search.audio')
for obj in resp['Contents']:
    keys.append(obj['Key'])
print(keys)



# import boto3
# import botocore

# BUCKET_NAME = 'search.audio' # replace with your bucket name
# KEY = 'audio 2018-02-01 16:14:58.663237' # replace with your object key

# s3 = boto3.resource('s3')

# try:
#     s3.Bucket(BUCKET_NAME).download_file(KEY, 'fromS3')
# except botocore.exceptions.ClientError as e:
#     if e.response['Error']['Code'] == "404":
#         print("The object does not exist.")
#     else:
#         raise