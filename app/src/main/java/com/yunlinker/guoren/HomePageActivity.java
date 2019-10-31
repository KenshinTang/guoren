package com.yunlinker.guoren;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.Gson;
import com.yunlinker.model.PageModel;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import butterknife.BindView;
import butterknife.ButterKnife;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import android.os.Build;
import static com.yunlinker.config.WebConfig.saveKey;
import android.transition.Fade;
import androidx.annotation.RequiresApi;
import android.transition.Transition;
import android.app.ActivityOptions;

public class HomePageActivity extends AppCompatActivity {
    @BindView(R.id.tv)
    TextView tv;
    private int recLen = 3;//跳过倒计时提示5秒
    Timer timer = new Timer();
    private Handler handler;
    private Runnable runnable;
    private static final String PAHT = "http://www.guorenapp.cn/guoren_pro/api/advert/startPageList?";
   // private static final String PAHT = "http://www.guorenapp.cn/guoren/api/advert/startPageList?";

    private Transition transition = null;

    private PageModel pageModel;
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_page);
        ButterKnife.bind(this);
        SharedPreferences sp = getSharedPreferences(saveKey, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.remove("face");
        editor.commit();
        initview();
        int flag = WindowManager.LayoutParams.FLAG_FULLSCREEN;
        //设置当前窗体为全屏显示
        getWindow().setFlags(flag, flag);
        timer.schedule(task, 1000, 1000);//等待时间一秒，停顿时间一秒
        /**
         * 正常情况下不点击跳过
         */
        handler = new Handler();
        handler.postDelayed(runnable = new Runnable() {
            @Override
            public void run() {
                //从闪屏界面跳转到首界面
                SharedPreferences sp = getSharedPreferences(saveKey, Context.MODE_PRIVATE);

                if (sp.getString("face","")!=null&&!sp.getString("face","").equals("")){
                    Intent intent = new Intent(HomePageActivity.this, AdvertisementActivity.class);
                    transition = new Fade();
                    transition.setDuration(1000);
                    getWindow().setEnterTransition(transition);
                    getWindow().setExitTransition(transition);
                    getWindow().setReenterTransition(transition);
                    getWindow().setReturnTransition(transition);
                    startActivity(intent, ActivityOptions.makeSceneTransitionAnimation(HomePageActivity.this).toBundle());
                }else {
                    Intent intent = new Intent(HomePageActivity.this, MainActivity.class);
                    transition = new Fade();
                    transition.setDuration(1000);
                    getWindow().setEnterTransition(transition);
                    getWindow().setExitTransition(transition);
                    getWindow().setReenterTransition(transition);
                    getWindow().setReturnTransition(transition);
                    startActivity(intent, ActivityOptions.makeSceneTransitionAnimation(HomePageActivity.this).toBundle());
                }

            }
        }, 1000);//延迟3S后发送handler信息


        hideBottomUIMenu();
    }





    /**
     * 隐藏虚拟按键，并且全屏
     */
    protected void hideBottomUIMenu(){
        //隐藏虚拟按键，并且全屏
        if (Build.VERSION.SDK_INT > 11 && Build.VERSION.SDK_INT < 19) { // lower api
            View v = this.getWindow().getDecorView();
            v.setSystemUiVisibility(View.GONE);
        } else if (Build.VERSION.SDK_INT >= 19) {
            //for new api versions.
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
//                    | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                    | View.SYSTEM_UI_FLAG_IMMERSIVE;
            decorView.setSystemUiVisibility(uiOptions);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        }
    }


    private void initview() {
        OkHttpClient okHttpClient = new OkHttpClient();
        final Request request=new Request.Builder()
                .url(PAHT)
                .get()
                .build();
        Call call = okHttpClient.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                //Toast.makeText(HomePageActivity.this, "请检查您的网络", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                try{
                    if (response.isSuccessful()){
                        String responseData=response.body().string();
                        Gson gson=new Gson();
                        pageModel = gson.fromJson(responseData,PageModel.class);
                        if (pageModel.getData()!=null){
                            imageData(pageModel);
                        }
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        });
    }



    private void imageData(PageModel pageModel){
        SharedPreferences sp = getSharedPreferences(saveKey, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        if (pageModel.getData()!=null){
            for (int i = 0;i<pageModel.getData().size();i++){
                String face = pageModel.getData().get(i).getFace();
                editor.putString("face",face);
                editor.commit();
            }
        }

    }

    TimerTask task = new TimerTask() {
        @Override
        public void run() {
            runOnUiThread(new Runnable() { // UI thread
                @Override
                public void run() {
                    recLen--;
                    tv.setText("跳过" + "(" + recLen + "s" + ")");
                    if (recLen < 0) {
                        timer.cancel();
                        tv.setVisibility(View.GONE);//倒计时到0隐藏字体
                    }
                }
            });
        }
    };

}
