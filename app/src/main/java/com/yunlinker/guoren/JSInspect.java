package com.yunlinker.guoren;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.alibaba.sdk.android.vod.upload.VODUploadCallback;
import com.alibaba.sdk.android.vod.upload.VODUploadClient;
import com.alibaba.sdk.android.vod.upload.VODUploadClientImpl;
import com.alibaba.sdk.android.vod.upload.model.UploadFileInfo;
import com.google.gson.Gson;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.ProductDetail;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.YSFOptions;
import com.qiyukf.unicorn.api.YSFUserInfo;

import com.umeng.message.IUmengCallback;
import com.umeng.message.PushAgent;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareConfig;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;
import com.yunlinker.addressbook.AddressBook;
import com.yunlinker.auth.WebPermissionManager;
import com.yunlinker.baseclass.BaseActivity;
import com.yunlinker.baseclass.BaseInspect;
import com.yunlinker.baseclass.BaseWebView;
import com.yunlinker.manager.HttpManager;
import com.yunlinker.map.Location;
import com.yunlinker.model.onVideoModel;
import com.yunlinker.myApp;
import com.yunlinker.pay.OnlinePay;
import com.yunlinker.util.DonwloadSaveImg;
import com.yunlinker.util.PermissionUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import static com.yunlinker.auth.WebPermissionManager.StoragePermissions;
import static com.yunlinker.config.WebConfig.saveKey;

//import com.yunlinker.image.ImageTool;

/**
 * Created by lemon on 2017/7/27.
 */

public class JSInspect extends BaseInspect {
    private boolean isRecording = false;
    private String mTmpFileAbs = "";
    public VODUploadClient uploader;
    private String PATH = "http://www.guorenapp.cn:8080/guoren/api/video/uploadTokenBySTS?_token";
    private OkHttpClient client;
    private onVideoModel videodata;
    public JSInspect(BaseWebView w, BaseActivity a) {
        super(w, a);
    }


    //注册推送
    @JavascriptInterface
    public void registerPush(final String obj) {
        int state = 0;
        String devicetk = "none";
        String tempTk = null;
        String url = null;
        if(obj != null) {
            try {
                JSONObject jb = new JSONObject(obj);
                mweb.setInsCode("registerPush",jb.getString("code"));
                state = jb.getInt("state");
                tempTk = jb.getString("token");
                url = jb.getString("url");
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        SharedPreferences sp = mactivity.getSharedPreferences(saveKey, Context.MODE_PRIVATE);
        if(state==1 || obj == null)
            devicetk = sp.getString("deviceToken", "");
        if(tempTk!=null && url!=null) {
            HashMap<String,String> tempParam = new HashMap<>();
            tempParam.put("devicetype",tempTk.length()>0?"1":"0");
            tempParam.put("devicetoken",devicetk);
            tempParam.put("_token",tempTk);
            tempParam.put("_device","2");
            final String furl = url;
            final HashMap<String,String> fparam = tempParam;
            new Thread(new Runnable() {
                @Override
                public void run() {
                    HttpManager.POST(furl, fparam);
                }
            }).start();
        }
        if(obj!=null)
            mweb.setValue("registerPush", "1");
    }
    //设置推送
    @JavascriptInterface
    public void setPush(final String obj) {
        String act = "";
        String open = "";
        try {
            JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("setPush",jb.getString("code"));
            act = jb.getString("act");
            open = jb.getString("value");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final SharedPreferences sp = mactivity.getSharedPreferences(saveKey, Context.MODE_PRIVATE);
        if(act.equals("get")) {
            String closeStr = sp.getString("closePush", "");
            mweb.setValue("setPush",(TextUtils.equals(closeStr,"1")?"0":"1"));
        } else if(act.equals("set")) {
            final String openStr = open;
            PushAgent push = PushAgent.getInstance(mactivity);
            IUmengCallback pushCb = new IUmengCallback() {
                @Override
                public void onSuccess() {
                    SharedPreferences.Editor editor = sp.edit();
                    String res = openStr.equals("1")?"0":"1";
                    editor.putString("closePush", res);
                    editor.apply();
                    mweb.setValue("setPush",openStr);
                }
                @Override
                public void onFailure(String s, String s1) {
                    mweb.setValue("setPush","0");
                }
            };
            if(Integer.parseInt(open)==1) {
                push.enable(pushCb);
            } else {
                push.disable(pushCb);
            }
        }
    }
    //支付
    private OnlinePay payObj;
    public OnlinePay getPay() {
        return payObj;
    }
    @JavascriptInterface
    public void pay(String obj) {
        try{
            JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("pay",jb.getString("code"));
            if(payObj==null) {
                payObj = new OnlinePay();
                payObj.payResult = new OnlinePay.PayResult() {
                    @Override
                    public void success() {
                        mweb.setValue("pay","{\"code\":1}");
                    }
                    @Override
                    public void error(String msg) {
                        mweb.setValue("pay","{\"code\":0,\"msg\":\""+msg+"\"}");
                    }
                };
            }
            payObj.startPay(jb, mactivity);
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    //获取位置信息
    @JavascriptInterface
    public void position(String code) {
        mweb.setInsCode("position",code);
        WebPermissionManager.getInstance(mactivity).CheckPermission(WebPermissionManager.LocationPermissions, new WebPermissionManager.OnPermissionBack() {
            @Override
            public void success() {
                Location.getInstance().position(mactivity, mweb);
            }

            @Override
            public void error() {
                mweb.setValue("position", "{\"code\":0}");
                Toast.makeText(mactivity,"授权失败，请设置权限后重试",Toast.LENGTH_SHORT).show();
            }
        });
    }

    //分享
    @JavascriptInterface
    public void shareUrl(String obj) {
         JSONObject jb = null;
        try{
            jb = new JSONObject(obj);
            mweb.setInsCode("shareUrl",jb.getString("code"));
        }catch(Exception e){}
        final JSONObject fjb = jb;
        WebPermissionManager.getInstance(mactivity).CheckPermission(StoragePermissions, new WebPermissionManager.OnPermissionBack() {
            @Override
            public void success() {
                startShare(fjb);
            }

            @Override
            public void error() {
                Toast.makeText(mactivity.getApplicationContext(), "获取权限失败，请检查权限后重试", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private UMShareListener umShareListener;
    private  SHARE_MEDIA share;
    private void startShare(JSONObject jb) {
        if(umShareListener==null) {
            umShareListener = new UMShareListener() {
                @Override
                public void onStart(SHARE_MEDIA share_media) {

                }

                @Override
                public void onResult(SHARE_MEDIA share_media) {
                    mweb.setValue("shareUrl","{\"code\":0,\"msg\": \"分享失败\"}");
                }

                @Override
                public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                    mweb.setValue("shareUrl","{\"code\":0,\"msg\": \"分享失败\"}");
                }

                @Override
                public void onCancel(SHARE_MEDIA share_media) {
                    mweb.setValue("shareUrl","{\"code\":0,\"msg\": \"分享失败\"}");
                }
            };
        }
        if(jb != null) {
            String title = "";
            String pic = "";
            String url = "";
            String desc = "";
            String base64 = null;
            try {
                if(jb.has("base64"))
                    base64 = jb.getString("base64");
                Log.e("嘀嘀嘀嘀嘀嘀嘀嘀", "startShare: "+base64);
                title = jb.getString("title");
                Log.e("嘀嘀嘀嘀嘀嘀嘀嘀", "startShare: "+title);
                pic = jb.getString("pic");
                Log.e("嘀嘀嘀嘀嘀嘀嘀嘀", "startShare: "+pic);
                url = jb.getString("url");
                Log.e("嘀嘀嘀嘀嘀嘀嘀嘀", "startShare: "+url);
                desc = jb.getString("desc");
                Log.e("嘀嘀嘀嘀嘀嘀嘀嘀", "startShare: "+desc);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            if(TextUtils.isEmpty(base64) && (TextUtils.isEmpty(title) || TextUtils.isEmpty(pic) || TextUtils.isEmpty(url) || TextUtils.isEmpty(desc))) {
                Toast.makeText(mactivity.getApplicationContext(), "分享异常，请稍后重试", Toast.LENGTH_SHORT).show();
                return;
            }
            UMImage umimg = null;
            UMWeb web = null;
            if(base64!=null) {
                byte[] bt = Base64.decode(base64, Base64.DEFAULT);
                umimg = new UMImage(mactivity, bt);
            } else {
                web = new UMWeb(url);
                web.setTitle(title);//标题
                UMImage thumb =  new UMImage(mactivity, pic);
                web.setThumb(thumb);  //缩略图
                web.setDescription(desc);//描述
            }
            int platform = 0;
            try {
                platform = Integer.parseInt(jb.getString("platform"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            ShareAction sa = new ShareAction(mactivity);
            if(umimg!=null) sa.withMedia(umimg);
            else sa.withMedia(web);
            sa.setCallback(umShareListener);
            if(platform>0) {
//                SHARE_MEDIA m = SHARE_MEDIA.WEIXIN;
//                SHARE_MEDIA m1 = SHARE_MEDIA.FACEBOOK;
//                if(platform==2) {
//                    m = SHARE_MEDIA.WEIXIN_CIRCLE;
//                }
//                if (platform==3){
//                    m1 = SHARE_MEDIA.FACEBOOK_MESSAGER;
//                }
                if (platform==1){
                    share = SHARE_MEDIA.WEIXIN;
                }
                if (platform==2){
                    share = SHARE_MEDIA.WEIXIN_CIRCLE;
                }
                if (platform==3){
                    share = SHARE_MEDIA.QQ;
                }
                if (platform==4){
                    share = SHARE_MEDIA.QZONE;
                }
                if (platform==5){
                    share = SHARE_MEDIA.SINA;
                }
                sa.setPlatform(share);
                sa.share();
            } else {
                sa.setDisplayList(SHARE_MEDIA.WEIXIN,SHARE_MEDIA.WEIXIN_CIRCLE);
                sa.open();
            }
        }
    }


    //打开外部浏览器
    @JavascriptInterface
    public void openUrlStr(String url){
        final Uri uri = Uri.parse(url);
        final Intent it = new Intent(Intent.ACTION_VIEW, uri);
        mactivity.startActivity(it);
    }

    private UMAuthListener authListener = null;
    @JavascriptInterface
    public void extLogin(final String obj) {
        UMShareConfig config = new UMShareConfig();
        config.isNeedAuthOnGetUserInfo(true);
        UMShareAPI.get(mactivity).setShareConfig(config);
        String type = "1";
        try {
            JSONObject jb = new JSONObject(obj);
            type = jb.getString("type");
            mweb.setInsCode("extLogin", jb.getString("code"));
        } catch (Exception e) {
        }
        final String platform = type;
        if (authListener == null) {
            authListener = new UMAuthListener() {
                @Override
                public void onStart(SHARE_MEDIA share_media) {

                }

                @Override
                public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                    JSONObject successJb = new JSONObject();
                    try {
                        String unionid = map.get("unionid");
                        if (unionid == null || unionid.length() <= 0)
                            unionid = map.get("openid");
                        successJb.put("unionid", unionid);
                        successJb.put("openid", map.get("openid"));
                        successJb.put("nickname", map.get("screen_name"));
                        successJb.put("sex", map.get("gender"));
                        successJb.put("face", map.get("profile_image_url"));
                        successJb.put("city", map.get("city"));
                        successJb.put("province", map.get("province"));
                        successJb.put("type", Integer.parseInt(platform));
                        successJb.put("code", "1");
                        Log.e("hehehehheheheeheh", "extLogin: "+"unionid"+successJb.put("unionid", unionid)+"openid"+successJb.put("openid", map.get("openid"))
                        +"nickname"+successJb.put("nickname", map.get("screen_name"))+"sex"+successJb.put("sex", map.get("gender"))+"face"+successJb.put("face", map.get("profile_image_url"))
                        +"city"+successJb.put("city", map.get("city"))+"province"+successJb.put("province", map.get("province"))
                                +"type"+successJb.put("type", Integer.parseInt(platform))+"code"+successJb.put("code", "1"));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
//                    UMShareAPI.get(mactivity).deleteOauth(mactivity, (Integer.parseInt(platform) == 2 ? SHARE_MEDIA.QQ : SHARE_MEDIA.WEIXIN), null);
                    if (successJb.has("unionid")) {
                        mweb.setValue("extLogin", successJb.toString());
                    } else {
                        mweb.setValue("extLogin", "{\"code\":0,\"msg\": \"获取用户登录信息失败\"}");
                    }
                }

                @Override
                public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                    mweb.setValue("extLogin", "{\"code\":0,\"msg\": \"第三方登录失败\"}");
                }

                @Override
                public void onCancel(SHARE_MEDIA share_media, int i) {
                    mweb.setValue("extLogin", "{\"code\":0,\"msg\": \"用户取消登录\"}");
                }
            };
        }
        if (Integer.parseInt(platform)==1) {
            UMShareAPI.get(mactivity).getPlatformInfo(mactivity, SHARE_MEDIA.WEIXIN, authListener);
        }else {
            UMShareAPI.get(mactivity).getPlatformInfo(mactivity, SHARE_MEDIA.QQ, authListener);
        }


    }


    @JavascriptInterface
    public void qiyu(String objStr){
        try {
            JSONObject jb = new JSONObject(objStr);
            if(!jb.has("login") || jb.getInt("login")==0) {
                //注销用户
                Unicorn.logout();
            } else {
                //打开客服窗口
                //如果用户存在展示用户信息
                if(jb.has("user")) {
                    JSONObject user =  jb.getJSONObject("user");
                    YSFUserInfo userInfo = new YSFUserInfo();
                    userInfo.userId = user.getString("userId");
                    userInfo.authToken = "";
                    userInfo.data="[\n" +
                            "    {\"key\":\"real_name\", \"value\":\""+user.getString("real_name")+"\"},\n" +
                            "    {\"key\":\"mobile_phone\", \"value\":\"" + user.getString("mobile_phone") + "\"},\n" +
                            "    {\"key\":\"avatar\", \"value\": \"" + user.getString("avatar") + "\"},\n" +
                            "]";
                    YSFOptions o = myApp.options();
                    o.uiCustomization.rightAvatar = user.getString("avatar");
                    Unicorn.updateOptions(o);
                    Unicorn.setUserInfo(userInfo);
                }

                ConsultSource source = new ConsultSource("", "", "");

                if(jb.has("goods")) {
                    JSONObject goods =  jb.getJSONObject("goods");
                    ProductDetail.Builder gb =  new ProductDetail.Builder();
                    gb.setTitle(goods.getString("title"));
                    gb.setPicture(goods.getString("picture"));
                    gb.setDesc(goods.getString("desc"));
                    gb.setNote(goods.getString("note"));
                    gb.setAlwaysSend(true);
                    source.productDetail = gb.create();
                }

                Unicorn.openServiceActivity(mactivity, "皮革客服", source);

            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    @JavascriptInterface
    public void saveImg(final String obj){
        WebPermissionManager.getInstance(mactivity).CheckPermission(StoragePermissions, new WebPermissionManager.OnPermissionBack() {
            @Override
            public void success() {
                JSONObject jb = null;
                String urls = null;
                String type = null;
                try{
                    jb = new JSONObject(obj);
                    urls = jb.getString("urls");
                    type = jb.getString("type");
//                    if (!type.equals(".gif")){
//                        DonwloadSaveImgs.donwloadImg(mactivity,urls);
//                    }else {
//                        DonwloadSaveImg.donwloadImg(mactivity,urls,type);
//                    }
                    DonwloadSaveImg.donwloadImg(mactivity,urls,type);
                }catch(Exception e){

                }

            }

            @Override
            public void error() {
                mweb.setValue("saveImg","{\"code\":0,\"msg\": \"存储权限读取失败\"}");
            }
        });
    }


    @JavascriptInterface
    public void copyText(String text){
        //获取剪贴板管理器：
        ClipboardManager cm = (ClipboardManager) mactivity.getSystemService(Context.CLIPBOARD_SERVICE);
        // 创建普通字符型ClipData
        ClipData mClipData = ClipData.newPlainText("Label", text);
        // 将ClipData内容放到系统剪贴板里。
        cm.setPrimaryClip(mClipData);
        Toast.makeText(mactivity.getApplicationContext(), "复制成功",
                Toast.LENGTH_SHORT).show();
    }


    @JavascriptInterface
    public void getAddressBook(String code) {
        mweb.setInsCode("getAddressBook",code);
        AddressBook.startGetList(mactivity, mweb);
    }

    @JavascriptInterface
    public void upVideo(String code){



    }


    @JavascriptInterface
    public void upSoundRecording(String code){
        try {

            if (checkPermission()) {
                mactivity.showToast("无异常");
            } else {
                mactivity.showToast("发现异常");
            }

            if (mactivity.mAudioRecord != null) {
                mactivity.mAudioRecord.release();
            }


        } catch (Exception e) {
            e.printStackTrace();
        }

    }







    private void start(){
        if (isRecording) {
            mactivity.showToast("已开始");
            return;
        }
        String tmpName = System.currentTimeMillis() + "_" + mactivity.mSampleRateInHZ + "";
        final File tmpFile = createFile(tmpName + ".pcm");
        final File tmpOutFile = createFile(tmpName + ".wav");
        mTmpFileAbs = tmpFile.getAbsolutePath();
        //mLogTv.setText(tmpFile.getAbsolutePath());

        isRecording = true;
        mactivity.mAudioRecord.startRecording();
        mactivity.mExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    FileOutputStream outputStream = new FileOutputStream(tmpFile.getAbsoluteFile());


                    while (isRecording) {
                        int readSize = mactivity.mAudioRecord.read(mactivity.mAudioData, 0, mactivity.mAudioData.length);
                        Log.e("11111111", "run: ------>" + readSize);
                        outputStream.write(mactivity.mAudioData);
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







    private void stop(){
        if (!isRecording) {
            mactivity.showToast("已结束");
            return;
        }

        isRecording = false;
        mactivity.mAudioRecord.stop();
    }

    private String accessKeyId;
    private String accessKeySecret;
    private String securityToken;
    private String expiration;


    /**
     * 上传视频语音文件
     */
    private void onUpload(){
        Request request = new Request.Builder()
                .url(PATH+"8ce2bf0fc32b48a988543667fcd1b408")
                .get()
                .build();
       client.newCall(request).enqueue(new Callback() {
           @Override
           public void onFailure(Call call, IOException e) {
               e.printStackTrace();
           }

           @Override
           public void onResponse(Call call, Response response){
             try {
                 if (response.isSuccessful()){
                     String video= response.body().string();
                     Gson gson = new Gson();
                     videodata = gson.fromJson(video,onVideoModel.class);
                     if (videodata.getData()!=null){
                         accessKeyId = videodata.getData().getAccessKeyId();
                         accessKeySecret = videodata.getData().getAccessKeySecret();
                         securityToken = videodata.getData().getSecurityToken();
                         expiration = videodata.getData().getExpiration();
                     }
                 }

             }catch (Exception e){
                 e.printStackTrace();
             }
           }
       });


        uploader = new VODUploadClientImpl(mactivity.getApplicationContext());

        VODUploadCallback callback = new VODUploadCallback() {
            @Override
            public void onUploadSucceed(UploadFileInfo info) {
                super.onUploadSucceed(info);
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

        uploader.init(accessKeyId,accessKeySecret,securityToken,expiration,callback);


    }

    private boolean checkPermission() {
        if (!PermissionUtil.isHasSDCardWritePermission(mactivity)) {
            PermissionUtil.requestSDCardWrite(mactivity);
            return false;
        }
        if (!PermissionUtil.isHasRecordPermission(mactivity)) {
            PermissionUtil.requestRecordPermission(mactivity);
            return false;
        }

        return true;
    }


    private void pcmToWave(String inFileName, String outFileName) {
        FileInputStream in = null;
        FileOutputStream out = null;
        long totalAudioLen = 0;
        long longSampleRate = mactivity.mSampleRateInHZ;
        long totalDataLen = totalAudioLen + 36;
        int channels = 1;//你录制是单声道就是1 双声道就是2（如果错了声音可能会急促等）
        long byteRate = 16 * longSampleRate * channels / 8;

        byte[] data = new byte[mactivity.mRecorderBufferSize];
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