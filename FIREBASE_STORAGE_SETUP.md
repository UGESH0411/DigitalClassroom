# Firebase Storage CORS Configuration

## Problem
When uploading files to Firebase Storage from localhost, you might encounter CORS (Cross-Origin Resource Sharing) errors.

## Solution

### Method 1: Using Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to Cloud Storage → Browser
4. Click on your storage bucket (`digital-classroom-5ca62.firebasestorage.app`)
5. Click on "Permissions" tab
6. Click "Add Principal"
7. Add these permissions:
   - Principal: `allUsers`
   - Role: `Storage Object Viewer`

### Method 2: Using Google Cloud SDK

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Authenticate: `gcloud auth login`
3. Set your project: `gcloud config set project digital-classroom-5ca62`
4. Apply CORS configuration:
   ```bash
   gsutil cors set cors.json gs://digital-classroom-5ca62.firebasestorage.app
   ```

### Method 3: Firebase Storage Rules (Alternative)

Update your Firebase Storage Rules in the Firebase Console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing

After applying CORS configuration:
1. Clear browser cache
2. Restart your development server
3. Try uploading a file again

## Troubleshooting

If you still see CORS errors:
1. Check Firebase Storage Rules
2. Verify your Firebase project ID
3. Ensure you're using the correct storage bucket URL
4. Try uploading from an incognito/private browser window