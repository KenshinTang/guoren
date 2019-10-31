package com.yunlinker.guoren;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import android.os.Build;
import androidx.appcompat.app.AppCompatActivity;

import org.xutils.x;

import java.util.Timer;
import java.util.TimerTask;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import android.transition.Fade;
import androidx.annotation.RequiresApi;
import android.view.Window;

import static com.yunlinker.config.WebConfig.saveKey;

public class AdvertisementActivity extends AppCompatActivity {


    @BindView(R.id.image_advertisement)
    ImageView imageAdvertisement;
    @BindView(R.id.tv_img)
    TextView tvImg;
    private int recLen = 5;//跳过倒计时提示5秒
    Timer timer = new Timer();
    private Handler handler;
    private Runnable runnable;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_CONTENT_TRANSITIONS);
        getWindow().setAllowEnterTransitionOverlap(true);
        getWindow().setAllowReturnTransitionOverlap(true);
        Fade fade = new Fade();
        fade.setDuration(1000);
        getWindow().setEnterTransition(fade);
        getWindow().setExitTransition(fade);
        setContentView(R.layout.activity_advertisement);
        ButterKnife.bind(this);
        int flag = WindowManager.LayoutParams.FLAG_FULLSCREEN;
        //设置当前窗体为全屏显示
        getWindow().setFlags(flag, flag);
        timer.schedule(task, 1000, 1000);//等待时间一秒，停顿时间一秒
        SharedPreferences sp = getSharedPreferences(saveKey, Context.MODE_PRIVATE);
        if (sp.getString("face", "") != null) {
            String face = sp.getString("face", "");
            x.image().bind(imageAdvertisement,
                    "http://guoren-app.oss-cn-shenzhen.aliyuncs.com/" + face);
        }
        handler = new Handler();
        handler.postDelayed(runnable = new Runnable() {
            @Override
            public void run() {
                //从闪屏界面跳转到首界面
                Intent intent = new Intent(AdvertisementActivity.this, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                finish();
            }
        }, 5000);//延迟3S后发送handler信息

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

    TimerTask task = new TimerTask() {
        @Override
        public void run() {
            runOnUiThread(new Runnable() { // UI thread
                @Override
                public void run() {
                    recLen--;
                    tvImg.setText("跳过" + "(" + recLen + "s" + ")");
                    if (recLen < 0) {
                        timer.cancel();
                        tvImg.setVisibility(View.GONE);//倒计时到0隐藏字体
                    }
                }
            });
        }
    };

    @OnClick(R.id.tv_img)
    public void onViewClicked() {
        Intent intent = new Intent(AdvertisementActivity.this, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
        if (runnable != null) {
            handler.removeCallbacks(runnable);
        }
    }
}
