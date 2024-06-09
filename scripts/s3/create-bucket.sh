#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <PROFILE_NAME> <BUCKET_NAME>"
    if [ -z "$1" ]; then
        echo "No profile name provided. Using default profile: $DEFAULT_PROFILE_NAME"
        PROFILE_NAME=$DEFAULT_PROFILE_NAME
    else
        PROFILE_NAME=$1
    fi
    if [ -z "$2" ]; then
        echo "No bucket name provided."
        exit 1
    else
        BUCKET_NAME=$2
    fi
else
    PROFILE_NAME=$1      # Set the API name from the second script argument
    BUCKET_NAME=$2  # Set the function name from the first script argument
fi

echo "aws s3api create-bucket --profile $PROFILE_NAME --bucket $BUCKET_NAME --region $REGION"
aws s3api create-bucket --profile $PROFILE_NAME --bucket $BUCKET_NAME --region $REGION

