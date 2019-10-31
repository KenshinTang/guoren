package com.yunlinker.guoren;


import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;

import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.alibaba.sdk.android.vod.upload.VODSVideoUploadCallback;
import com.alibaba.sdk.android.vod.upload.VODSVideoUploadClient;
import com.alibaba.sdk.android.vod.upload.VODSVideoUploadClientImpl;
import com.alibaba.sdk.android.vod.upload.VODUploadCallback;
import com.alibaba.sdk.android.vod.upload.VODUploadClient;
import com.alibaba.sdk.android.vod.upload.VODUploadClientImpl;
import com.alibaba.sdk.android.vod.upload.model.SvideoInfo;
import com.alibaba.sdk.android.vod.upload.model.UploadFileInfo;
import com.alibaba.sdk.android.vod.upload.model.VodInfo;
import com.alibaba.sdk.android.vod.upload.session.VodHttpClientConfig;
import com.alibaba.sdk.android.vod.upload.session.VodSessionCreateInfo;
import com.google.gson.Gson;
import com.yunlinker.model.onVideoModel;
import com.yunlinker.util.PermissionUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;


public class SoundRecordingActivity extends AppCompatActivity {


    public VODUploadClient uploader;
    private String PATH = "http://www.guorenapp.cn/guoren/api/video/uploadTokenBySTS?_token=";
    private onVideoModel videodata;
    private VODSVideoUploadClient vodsVideoUploadClient;

    private EditText mRateEdt;
    private EditText mAudioFormatEdt;
    private TextView mLogTv;
    private Button check_btn,start_btn,end_btn,uploade,video_choice;

    /**
     * 录音数队列
     */
    private ConcurrentLinkedQueue<byte[]> audioQueue = new ConcurrentLinkedQueue<byte[]>();
    private ThreadPoolExecutor mExecutor = new ThreadPoolExecutor(2, 2, 60, TimeUnit.SECONDS,
            new LinkedBlockingQueue<Runnable>());

    private AudioTrack mAudioTrack;
    private AudioRecord mAudioRecord;
    private int mRecorderBufferSize;
    private byte[] mAudioData;

    /*默认数据*/
    private int mSampleRateInHZ = 8000; //采样率
    private int mAudioFormat = AudioFormat.ENCODING_PCM_16BIT;  //位数
    private int mChannelConfig = AudioFormat.CHANNEL_IN_MONO;   //声道
    private OkHttpClient mOkHttpClient = new OkHttpClient();

    private boolean isRecording = false;
    private String mTmpFileAbs = "";

    public static String VOD_REGION = "cn-shanghai";
    public static boolean VOD_RECORD_UPLOAD_PROGRESS_ENABLED = true;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sound_recording);

        mRateEdt = (EditText)findViewById(R.id.rate_edt);
        mAudioFormatEdt = (EditText)findViewById(R.id.audio_format_edt);
        mLogTv = (TextView)findViewById(R.id.log_tv);
        check_btn = (Button)findViewById(R.id.check_btn);
        start_btn = (Button)findViewById(R.id.start_btn);
        end_btn = (Button)findViewById(R.id.end_btn);
        uploade = (Button)findViewById(R.id.uploade);
        video_choice = (Button)findViewById(R.id.video_choice);
        initView();
        initData();
        //OSSLog.enableLog();
    }

    private void initData() {
        mRecorderBufferSize = AudioRecord.getMinBufferSize(mSampleRateInHZ, mChannelConfig, mAudioFormat);
        mAudioData = new byte[320];
        mAudioRecord = new AudioRecord(MediaRecorder.AudioSource.VOICE_COMMUNICATION, mSampleRateInHZ, mChannelConfig, mAudioFormat, mRecorderBufferSize);
    }

    private void initView() {
        mRateEdt.setText(mSampleRateInHZ + "");
        mAudioFormatEdt.setText(mAudioFormat + "");
        check_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isRecording) {
                    showToast("录音中，请暂停");
                    return;
                }
                if (checkPermission()) {
                    showToast("无异常");
                } else {
                    showToast("发现异常");
                }


                if (mAudioRecord != null) {
                    mAudioRecord.release();
                }
                mSampleRateInHZ = Integer.parseInt(mRateEdt.getText().toString());
                mAudioFormat = Integer.parseInt(mAudioFormatEdt.getText().toString());
                initData();
            }
        });


        start_btn.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                         start();
                        break;
                        //按下 break;
                    case MotionEvent.ACTION_MOVE:
                        break;
                        //移动 break;
                    case MotionEvent.ACTION_UP:
                        stop();
                        break;
                        //抬起 break;
                }
                return false;
            }
        });


     uploade.setOnClickListener(new View.OnClickListener() {
         @Override
         public void onClick(View v) {
             upload();
         }
     });


        video_choice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                Intent intent = new Intent(SoundRecordingActivity.this, PickerActivity.class);
//                intent.putExtra(PickerConfig.SELECT_MODE,PickerConfig.PICKER_IMAGE_VIDEO);
//                startActivityForResult(intent,200);

//                EasyPhotos.createAlbum(SoundRecordingActivity.this, true, GlideEngine.getInstance())
//                        .setFileProviderAuthority("com.huantansheng.easyphotos.demo.fileprovider")
//                        .setCount(1)
//                        .setVideo(true)
//                        .setGif(true)
//                        .start(101);

               // DonwloadSaveImg.donwloadImg(SoundRecordingActivity.this,"http://guoren-app.oss-cn-shenzhen.aliyuncs.com/2019_06/aht4r31559567822316.jpg");

                   //  loadImage("http://guoren-app.oss-cn-shenzhen.aliyuncs.com/2019_06/aht4r31559567822316.jpg");

                try {
//                    Uri uri = Uri.parse("smsto:");
//                    Intent it = new Intent(Intent.ACTION_SENDTO,uri);
//                    it.putExtra("sms_body", "The SMS text");
//                    startActivity(it);

                    Intent it = new Intent(Intent.ACTION_VIEW);
                    it.putExtra("sms_body", "The SMS text");
                    it.setType("vnd.android-dir/mms-sms");
                    startActivity(it);


                } catch (Exception e) {
                    Toast.makeText(SoundRecordingActivity.this, "打开邮箱失败", Toast.LENGTH_SHORT).show();
                }

            }
        });


    }





    private void loadImage(final String url) {

    }


    private void onSaveBitmap(final Bitmap mBitmap,final Context context) {
        Log.e("11111111", "onResponse: "+"成功");
        new Thread(new Runnable() {
            public void run() {
                try{

                    String photoPath = "/storage/emulated/0/DCIM/camera"+
                            generateFileName()+".jpg";

                    //创建文件对象，用来存储新的图像文件
                    File file = new File(photoPath);
                    //创建文件
                    try {
                        file.createNewFile();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    //定义文件输出流
                    FileOutputStream fOut = new FileOutputStream(file);
                    //将bitmap存储为jpg格式的图片
                    mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fOut);
                    fOut.flush();//刷新文件流
                    fOut.close();

                    //文件存储已经完毕，保存的图片没有加入到系统图库中
                    //，此时需要发送广播，刷新图库，很简单几行代码搞定
                    Intent intent =
                            new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                    Uri uri = Uri.fromFile(new File(photoPath));
                    intent.setData(uri);
                    context.sendBroadcast(intent);
                }catch (Exception e){

                }
            }
        }).start();
    }


    @NonNull
    private String generateFileName(){
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(currentTime);
        return "TV_Screenshot_"+dateString;

    }




    private String filePath;


    private void start(){
        if (isRecording) {
            showToast("已开始");
            return;
        }
        String tmpName = System.currentTimeMillis() + "_" + mSampleRateInHZ + "";
        final File tmpFile = createFile(tmpName + ".pcm");
        final File tmpOutFile = createFile(tmpName + ".wav");
        filePath = tmpOutFile.getPath();
        Log.e("1111111111111", "start: "+filePath);
        mTmpFileAbs = tmpFile.getAbsolutePath();
        mLogTv.setText(tmpFile.getAbsolutePath());

        isRecording = true;
        mAudioRecord.startRecording();
        mExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    FileOutputStream outputStream = new FileOutputStream(tmpFile.getAbsoluteFile());
                    while (isRecording) {
                        int readSize = mAudioRecord.read(mAudioData, 0, mAudioData.length);
                        Log.e("11111111", "run: ------>" + readSize);
                        outputStream.write(mAudioData);
                    }

                    outputStream.close();
                    pcmToWave(tmpFile.getAbsolutePath(), tmpOutFile.getAbsolutePath());
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

//        if (requestCode==200&&requestCode == PickerConfig.RESULT_CODE){
//            Log.e("onActivityResult", "onActivityResult: "+data.getParcelableArrayListExtra(PickerConfig.EXTRA_RESULT));
//        }

//        if (requestCode == 101) {
//            //返回图片地址集合：如果你只需要获取图片的地址，可以用这个
//            ArrayList<String> resultPaths = data.getStringArrayListExtra(EasyPhotos.RESULT_PATHS);
//            for (String resultPath : resultPaths) {
//                Log.e("101", "onActivityResult: "+resultPath);
//                upVideo(resultPath);
//            }
//            return;
//        }
    }
    //定义获取接口的参数
    String accessKeyId;
    String accessKeySecret;
    String securityToken;
    String expriedTime;

    private void upVideo(String path){

        //初始化短视频上传对象
        VODSVideoUploadClient vodsVideoUploadClient = new VODSVideoUploadClientImpl(this.getApplicationContext());
        vodsVideoUploadClient.init();
        //2.构建上传参数
        //参数请确保存在，如不存在SDK内部将会直接将错误throw Exception
        // 文件路径保证存在之外因为Android 6.0之后需要动态获取权限，请开发者自行实现获取"文件读写权限".
        VodHttpClientConfig vodHttpClientConfig = new VodHttpClientConfig.Builder()
                .setMaxRetryCount(2)//重试次数
                .setConnectionTimeout(15*1000)//连接超时
                .setSocketTimeout(15*1000)//socket超时
                .build();
        //构建短视频VideoInfo,常见的描述，标题，详情都可以设置
        final SvideoInfo svideoInfo = new SvideoInfo();
        svideoInfo.setTitle(new File(path).getName());//标题
        svideoInfo.setDesc("");//文件详情
        svideoInfo.setCateId(1);//分类id


        OkHttpClient okHttp = new OkHttpClient();
        Request request = new Request.Builder()
                .url(PATH+"2a575673ac7f43a8b8f8b7d206eb7e19")
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
                        videodata = gson.fromJson(video,onVideoModel.class);
                        if (videodata.getData()!=null){
                        }
                    }

                }catch (Exception e){
                    e.printStackTrace();
                    Log.e("yichang", "onResponse: "+e.getMessage());
                }
            }


        });





        //构建点播上传参数(重要)
        VodSessionCreateInfo vodSessionCreateInfo =new    VodSessionCreateInfo.Builder()
                .setVideoPath(path)
                .setAccessKeyId(accessKeyId)//临时accessKeyId
                .setAccessKeySecret(accessKeySecret)//临时accessKeySecret
                .setSecurityToken(securityToken)//securityToken
                .setExpriedTime(expriedTime)//STStoken过期时间
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






    private void stop(){
        if (!isRecording) {
            showToast("已结束");
            return;
        }

        isRecording = false;
        mAudioRecord.stop();
    }



    private boolean checkPermission() {
        if (!PermissionUtil.isHasSDCardWritePermission(this)) {
            PermissionUtil.requestSDCardWrite(this);
            return false;
        }
        if (!PermissionUtil.isHasRecordPermission(this)) {
            PermissionUtil.requestRecordPermission(this);
            return false;
        }

        return true;
    }



    private void showToast(String content) {
        Toast.makeText(this, content, Toast.LENGTH_SHORT).show();
    }


    private void pcmToWave(String inFileName, String outFileName) {
        FileInputStream in = null;
        FileOutputStream out = null;
        long totalAudioLen = 0;
        long longSampleRate = mSampleRateInHZ;
        long totalDataLen = totalAudioLen + 36;
        int channels = 1;//你录制是单声道就是1 双声道就是2（如果错了声音可能会急促等）
        long byteRate = 16 * longSampleRate * channels / 8;

        byte[] data = new byte[mRecorderBufferSize];
        try {
            in = new FileInputStream(inFileName);
            out = new FileOutputStream(outFileName);

            totalAudioLen = in.getChannel().size();
            totalDataLen = totalAudioLen + 36;
            writeWaveFileHeader(out, totalAudioLen, totalDataLen, longSampleRate, channels, byteRate);
            while (in.read(data) != -1) {
                out.write(data);
            }

            in.close();
            out.close();
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }



    private File createFile(String name) {

        String dirPath = Environment.getExternalStorageDirectory().getPath() + "/AudioRecord/";
        Log.e("111111111", "createFile: "+dirPath);
        File file = new File(dirPath);

        if (!file.exists()) {
            file.mkdirs();
        }

        String filePath = dirPath + name;
        File objFile = new File(filePath);
        if (!objFile.exists()) {
            try {
                objFile.createNewFile();
                return objFile;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return null;
    }



    private void upload(){
        OkHttpClient okHttp = new OkHttpClient();
        Request request = new Request.Builder()
                .url(PATH+"0715925db76a4d67b3259c0e3b0c71ca")
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
                        videodata = gson.fromJson(video,onVideoModel.class);
                        if (videodata.getData()!=null){
                            onUpload(videodata);
                        }
                    }

                }catch (Exception e){
                    e.printStackTrace();
                    Log.e("yichang", "onResponse: "+e.getMessage());
                }
            }
        });
    }


    /**
     * 上传语音文件
     */
    private void onUpload(final onVideoModel videodata){
        Log.e("进来没有", "onUpload: "+videodata.toString());
        final VODUploadClient uploader = new VODUploadClientImpl(getApplicationContext());
        VODUploadCallback callback = new VODUploadCallback() {
            @Override
            public void onUploadSucceed(UploadFileInfo info) {
                super.onUploadSucceed(info);
                Log.e("11111", "onUploadSucceed: "+info.getFilePath());
                Log.e("11111", "onUploadSucceed: "+info.getVodInfo());
                Log.e("11111", "onUploadSucceed: "+info.getVodInfo().getCateId());
            }

            @Override
            public void onUploadFailed(UploadFileInfo info, String code, String message) {
                super.onUploadFailed(info, code, message);
            }

            @Override
            public void onUploadProgress(UploadFileInfo info, long uploadedSize, long totalSize) {
                super.onUploadProgress(info, uploadedSize, totalSize);
            }

            @Override
            public void onUploadTokenExpired() {
                super.onUploadTokenExpired();
                uploader.resumeWithToken(videodata.getData().getAccessKeyId(),
                        videodata.getData().getAccessKeySecret(),
                        videodata.getData().getSecurityToken(),
                        videodata.getData().getExpiration());
            }

            @Override
            public void onUploadRetry(String code, String message) {
                super.onUploadRetry(code, message);
            }

            @Override
            public void onUploadRetryResume() {
                super.onUploadRetryResume();
            }

            @Override
            public void onUploadStarted(UploadFileInfo uploadFileInfo) {
                super.onUploadStarted(uploadFileInfo);
            }

        };
        uploader.init(videodata.getData().getAccessKeyId(),
                videodata.getData().getAccessKeySecret(),
                videodata.getData().getSecurityToken(),
                videodata.getData().getExpiration(),
                callback);
        VodInfo vodinfo = new VodInfo();
        vodinfo.setTitle("测试");
        vodinfo.setDesc("测试上传");
        vodinfo.setCateId(19);
        Log.e("videodata", "onUpload: "+filePath);
        uploader.addFile(filePath,vodinfo);
        uploader.start();

    }




    /*
    任何一种文件在头部添加相应的头文件才能够确定的表示这种文件的格式，wave是RIFF文件结构，每一部分为一个chunk，其中有RIFF WAVE chunk，
    FMT Chunk，Fact chunk,Data chunk,其中Fact chunk是可以选择的，
     */
    private void writeWaveFileHeader(FileOutputStream out, long totalAudioLen, long totalDataLen, long longSampleRate,
                                     int channels, long byteRate) throws IOException {
        byte[] header = new byte[44];
        header[0] = 'R'; // RIFF
        header[1] = 'I';
        header[2] = 'F';
        header[3] = 'F';
        header[4] = (byte) (totalDataLen & 0xff);//数据大小
        header[5] = (byte) ((totalDataLen >> 8) & 0xff);
        header[6] = (byte) ((totalDataLen >> 16) & 0xff);
        header[7] = (byte) ((totalDataLen >> 24) & 0xff);
        header[8] = 'W';//WAVE
        header[9] = 'A';
        header[10] = 'V';
        header[11] = 'E';
        //FMT Chunk
        header[12] = 'f'; // 'fmt '
        header[13] = 'm';
        header[14] = 't';
        header[15] = ' ';//过渡字节
        //数据大小
        header[16] = 16; // 4 bytes: size of 'fmt ' chunk
        header[17] = 0;
        header[18] = 0;
        header[19] = 0;
        //编码方式 10H为PCM编码格式
        header[20] = 1; // format = 1
        header[21] = 0;
        //通道数
        header[22] = (byte) channels;
        header[23] = 0;
        //采样率，每个通道的播放速度
        header[24] = (byte) (longSampleRate & 0xff);
        header[25] = (byte) ((longSampleRate >> 8) & 0xff);
        header[26] = (byte) ((longSampleRate >> 16) & 0xff);
        header[27] = (byte) ((longSampleRate >> 24) & 0xff);
        //音频数据传送速率,采样率*通道数*采样深度/8
        header[28] = (byte) (byteRate & 0xff);
        header[29] = (byte) ((byteRate >> 8) & 0xff);
        header[30] = (byte) ((byteRate >> 16) & 0xff);
        header[31] = (byte) ((byteRate >> 24) & 0xff);
        // 确定系统一次要处理多少个这样字节的数据，确定缓冲区，通道数*采样位数
        header[32] = (byte) (1 * 16 / 8);
        header[33] = 0;
        //每个样本的数据位数
        header[34] = 16;
        header[35] = 0;
        //Data chunk
        header[36] = 'd';//data
        header[37] = 'a';
        header[38] = 't';
        header[39] = 'a';
        header[40] = (byte) (totalAudioLen & 0xff);
        header[41] = (byte) ((totalAudioLen >> 8) & 0xff);
        header[42] = (byte) ((totalAudioLen >> 16) & 0xff);
        header[43] = (byte) ((totalAudioLen >> 24) & 0xff);
        out.write(header, 0, 44);
    }



}
