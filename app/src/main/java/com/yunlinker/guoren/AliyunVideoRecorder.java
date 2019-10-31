package com.yunlinker.guoren;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadataRetriever;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Environment;

import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;

import com.alibaba.sdk.android.vod.upload.VODSVideoUploadCallback;
import com.alibaba.sdk.android.vod.upload.VODSVideoUploadClient;
import com.alibaba.sdk.android.vod.upload.VODSVideoUploadClientImpl;
import com.alibaba.sdk.android.vod.upload.model.SvideoInfo;
import com.alibaba.sdk.android.vod.upload.session.VodHttpClientConfig;
import com.alibaba.sdk.android.vod.upload.session.VodSessionCreateInfo;
import com.google.gson.Gson;
import com.yunlinker.model.onVideoModel;
import com.yunlinker.util.DifferentNotifications;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class AliyunVideoRecorder extends AppCompatActivity {

    private Button upvideo;
    onVideoModel videodata;
    private String PATH = "http://www.guorenapp.cn/guoren/api/video/uploadTokenBySTS?_token=";
      //初始化短视频上传对象
      private VODSVideoUploadClient vodsVideoUploadClient;
      //构建点播上传参数(重要)
      private  VodSessionCreateInfo vodSessionCreateInfo;

      private  VodHttpClientConfig vodHttpClientConfig;

      private  SvideoInfo svideoInfo;

    private int i=1;
    private int MQTT_IM_NOTIFICATION_ID=1007;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_aliyun_video_recorder);

        String content = 2 + "个联系人发了" + i + "条消息";
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getBaseContext());
        builder.setSmallIcon(R.mipmap.ic_launcher);
        builder.setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher));
        builder.setTicker("收到" + i + "条消息");
        builder.setWhen(System.currentTimeMillis());
        Intent intent = new Intent(getBaseContext(), AliyunVideoRecorder.class);

        intent.setAction(getApplicationContext().getPackageName());
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(getBaseContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        builder.setContentIntent(pi);
        builder.setContentTitle(getResources().getText(R.string.app_name));
        builder.setContentText(content);

        final Notification n = builder.build();
        int defaults = Notification.DEFAULT_LIGHTS;

        defaults |= Notification.DEFAULT_SOUND;

        defaults |= Notification.DEFAULT_VIBRATE;


        n.defaults = defaults;
        n.flags = Notification.FLAG_SHOW_LIGHTS | Notification.FLAG_AUTO_CANCEL;


        upvideo = (Button) findViewById(R.id.upvideo);



        upvideo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                EasyPhotos.createAlbum(AliyunVideoRecorder.this, true, GlideEngine.getInstance())
//                        .setFileProviderAuthority("com.huantansheng.easyphotos.demo.fileprovider")
//                        .setCount(1)
//                        .setVideo(true)
//                        .setGif(true)
//                        .start(101);
                DifferentNotifications.showBubble(getBaseContext(),n,MQTT_IM_NOTIFICATION_ID, i++);

            }
        });
        int netWorkInfo = getNetWorkInfo(this);
        if (netWorkInfo==-1){
            Toast.makeText(this, "请连接网络哟", Toast.LENGTH_SHORT).show();
        }else if (netWorkInfo==0){
            Toast.makeText(this, "使用的是手机网络哟", Toast.LENGTH_SHORT).show();
        }else {
            Toast.makeText(this, "使用的是wifi网络哟", Toast.LENGTH_SHORT).show();
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 101) {
            //返回图片地址集合：如果你只需要获取图片的地址，可以用这个
//            ArrayList<String> resultPaths = data.getStringArrayListExtra(EasyPhotos.RESULT_PATHS);
//            for (String resultPath : resultPaths) {
//                Log.e("101", "onActivityResult: "+resultPath);
//                //getPicture(resultPath);
//                double size = FileSizeUtil.getFileOrFilesSize(resultPath, 3);
//                Log.e("FileSizeUtil", "size: "+size);
//                if (size>20){
//                    Toast.makeText(this, "视频超过20M请重新选择", Toast.LENGTH_SHORT).show();
//                    return;
//                }else {
//                    getPicture(resultPath);
//                }
//            }
            return;
        }
    }




    public void getPicture(String path){

        Log.e("Tony", "Path:"+ path);
        //将路径实例化为一个文件对象
        File file = new File(path);
        //判断对象是否存在，不存在的话给出Toast提示
        if(file.exists()){
            //提供统一的接口用于从一个输入媒体中取得帧和元数据
            MediaMetadataRetriever retriever = new MediaMetadataRetriever();
            retriever.setDataSource(path);
            String time = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
            Log.e("Tony", "Time:"+ time);

            int seconds = Integer.valueOf(time) / 1000;

            seconds = 2;

            for (int i = 1; i < seconds; i++){
                Bitmap bitmap = retriever.getFrameAtTime(i*1000*1000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                String pathPic = Environment.getExternalStorageDirectory()+File.separator + i + ".jpg";

                upVideo(path,pathPic);

                Log.e("11111111111", "getPicture: "+pathPic);
                FileOutputStream fos = null;
                try {
                    fos = new FileOutputStream(pathPic);
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 80, fos);
                    Log.e("Tony", "Picture Got");
                    fos.close();
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }else {
            Toast.makeText(AliyunVideoRecorder.this, "文件不存在", Toast.LENGTH_SHORT).show();
        }
    }




    private void upVideo(final String path , final String pathPic){

        OkHttpClient okHttp = new OkHttpClient();
        Request request = new Request.Builder()
                .url(PATH+"4f477653bb8441ef854967059e8ee332")
                .get()
                .build();
        Call calle = okHttp.newCall(request);
        calle.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) {
                try {
                    if (response.isSuccessful()){
                        String video= response.body().string();
                        Gson gson = new Gson();
                        videodata = gson.fromJson(video, onVideoModel.class);
                        if (videodata.getData()!=null){
                            upvideos(videodata,path,pathPic);
                        }
                    }

                }catch (Exception e){
                    e.printStackTrace();
                    Log.e("yichang", "onResponse: "+e);
                }
            }

        });


    }

    private void upvideos(onVideoModel videodata,String path,String pathPic){

        vodsVideoUploadClient = new VODSVideoUploadClientImpl(this.getApplicationContext());
        vodsVideoUploadClient.init();
        //2.构建上传参数
        //参数请确保存在，如不存在SDK内部将会直接将错误throw Exception
        // 文件路径保证存在之外因为Android 6.0之后需要动态获取权限，请开发者自行实现获取"文件读写权限".
        vodHttpClientConfig = new VodHttpClientConfig.Builder()
                .setMaxRetryCount(2)//重试次数
                .setConnectionTimeout(15*1000)//连接超时
                .setSocketTimeout(15*1000)//socket超时
                .build();
        //构建短视频VideoInfo,常见的描述，标题，详情都可以设置
        svideoInfo = new SvideoInfo();
        svideoInfo.setTitle(new File(path).getName());//标题
        svideoInfo.setDesc("高速路飙车");//文件详情
        svideoInfo.setCateId(1);//分类id

        //构建点播上传参数(重要)
         vodSessionCreateInfo =new VodSessionCreateInfo.Builder()
                 .setImagePath(pathPic)
                 .setVideoPath(path)
                 .setPartSize(2*1024*1024)
                 .setAccessKeyId(videodata.getData().getAccessKeyId())//临时accessKeyId
                 .setAccessKeySecret(videodata.getData().getAccessKeySecret())//临时accessKeySecret
                 .setSecurityToken(videodata.getData().getSecurityToken())//securityToken
                 .setExpriedTime(videodata.getData().getExpiration())//STStoken过期时间
                 .setIsTranscode(true)//是否转码.如开启转码请AppSever务必监听服务端转码成功的通知
                 .setSvideoInfo(svideoInfo)//短视频视频信息
                 .setVodHttpClientConfig(vodHttpClientConfig)//网络参数
                 .build();

        vodsVideoUploadClient.uploadWithVideoAndImg(vodSessionCreateInfo, new VODSVideoUploadCallback() {
            @Override
            public void onUploadSucceed(String s, String s1) {
                //上传成功返回视频ID和图片URL.
                Log.e("onUploadSucceed", "s"+s+"s1"+s1);

            }

            @Override
            public void onUploadFailed(String s, String s1) {
                //上传失败返回错误码和message.错误码有详细的错误信息请开发者仔细阅读
                Log.e("onUploadFailed", "code" + s + "message" + s1);
            }

            @Override
            public void onUploadProgress(long l, long l1) {

            }

            @Override
            public void onSTSTokenExpried() {

            }

            @Override
            public void onUploadRetry(String s, String s1) {

            }

            @Override
            public void onUploadRetryResume() {

            }
        });
    }





    //  判断手机的网络状态（是否联网）
    public static int getNetWorkInfo(Context context) {
        //网络状态初始值
        int type = -1;  //-1(当前网络异常，没有联网)
        //通过上下文得到系统服务，参数为网络连接服务，返回网络连接的管理类
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        //通过网络管理类的实例得到联网日志的状态，返回联网日志的实例
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        //判断联网日志是否为空
        if (activeNetworkInfo == null) {
            //状态为空当前网络异常，没有联网
            return type;
        }
        //不为空得到使用的网络类型
        int type1 = activeNetworkInfo.getType();
        //网络类型为运营商（移动/联通/电信）
        if (type1 == ConnectivityManager.TYPE_MOBILE) {
            // 注：如果想要判断其他网络类型进入ConnectivityManager类中根据常量值判断
            type = 0;
            //网络类型为WIFI（无线网）
        } else if (type1 == ConnectivityManager.TYPE_WIFI) {

            type = 1;
        }
        //返回网络类型
        return type;
    }




}
