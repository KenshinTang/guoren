package com.yunlinker.upimage.aliupload;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.TextUtils;
import android.util.Log;

import com.alibaba.sdk.android.oss.ClientException;
import com.alibaba.sdk.android.oss.OSS;
import com.alibaba.sdk.android.oss.ServiceException;
import com.alibaba.sdk.android.oss.callback.OSSCompletedCallback;
import com.alibaba.sdk.android.oss.callback.OSSProgressCallback;
import com.alibaba.sdk.android.oss.internal.OSSAsyncTask;
import com.alibaba.sdk.android.oss.model.PutObjectRequest;
import com.alibaba.sdk.android.oss.model.PutObjectResult;
import com.yunlinker.upimage.UpImger;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Map;


public class OssService {

    private OSS oss;
    private String bucket;
    private ArrayList<Map> uploadList;


    public OssService(OSS oss, String bucket) {
        this.oss = oss;
        this.bucket = bucket;
    }

    public void configUploadList(ArrayList<Map> list) {
        successList = new ArrayList<>();
        uploadList = list;
    }

    private ArrayList<String> successList;
    public void uploadImgs() {
        if(uploadList.size()>0) {
            String object = (String)uploadList.get(0).get("name");
            String path = (String)uploadList.get(0).get("path");
            asyncUploadImage(object, path);
            uploadList.remove(0);
        } else {
            //全部上传完成
            UpImger.getInstance().uploadEvent.finished(successList);
        }
    }

    private void asyncUploadImage(final String object, String localFile) {
        if (object.equals("")) {
            Log.e("AsyncPutImage", "ObjectNull");
            return;
        }

        File file = new File(localFile);
        if (!file.exists()) {
            Log.e("AsyncPutImage", "FileNotExist");
            Log.e("LocalFile", localFile);
            return;
        }

        String uploadFileStr = convertToPngIfWebP(localFile);

        // 构造上传请求
        PutObjectRequest put = new PutObjectRequest(bucket, object, uploadFileStr);


        // 异步上传时可以设置进度回调
        put.setProgressCallback(new OSSProgressCallback<PutObjectRequest>() {
            @Override
            public void onProgress(PutObjectRequest request, long currentSize, long totalSize) {
            }
        });

        OSSAsyncTask task = oss.asyncPutObject(put, new OSSCompletedCallback<PutObjectRequest, PutObjectResult>() {
            @Override
            public void onSuccess(PutObjectRequest request, PutObjectResult result) {
                successList.add(object);
                uploadImgs();
            }

            @Override
            public void onFailure(PutObjectRequest request, ClientException clientExcepion, ServiceException serviceException) {
                uploadImgs();
            }
        });
    }

    private String convertToPngIfWebP(String inputPath) {
        Log.d("kenshin", "before convert, input path = " + inputPath);
        String pathWithoutSuffix = inputPath.substring(0, inputPath.lastIndexOf("."));
        String outputPath = pathWithoutSuffix + ".png";
        Log.d("kenshin", "before convert, output path = " + outputPath);

        try {
            FileOutputStream out = new FileOutputStream(outputPath);
            BitmapFactory.Options options = new BitmapFactory.Options();
            Bitmap bitmap = BitmapFactory.decodeFile(inputPath, options);
            String mimeType = options.outMimeType;
            Log.d("kenshin", "before convert, mimeType = " + mimeType);
            if (mimeType.equals("image/webp")) {
                Log.d("kenshin", "input is webp, convert to png before upload.");
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
                out.close();
                return outputPath;
            } else {
                Log.d("kenshin", "input is not webp, no need to convert, upload directly.");
                return inputPath;
            }

        } catch (Exception e) {
            Log.e("kenshin", "outputPath = null", e);
            return inputPath;
        }
    }
}
