<?php
/* お問い合わせフォーム送信処理
   MSG株式会社 - セキュアなフォーム処理 */

// セキュリティ設定
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CSRF対策
session_start();

// POSTメソッドのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// 設定
define('ADMIN_EMAIL', 'contact@msg-corp.co.jp'); // 実際のメールアドレスに変更
define('SUBJECT_PREFIX', '[MSG株式会社] お問い合わせ - ');

try {
    // 入力データの取得とサニタイズ
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $company = filter_input(INPUT_POST, 'company', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    
    // バリデーション
    $errors = [];
    
    // 必須項目チェック
    if (empty($name)) {
        $errors[] = 'お名前は必須項目です。';
    }
    
    if (empty($email)) {
        $errors[] = 'メールアドレスは必須項目です。';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = '正しいメールアドレスを入力してください。';
    }
    
    if (empty($message)) {
        $errors[] = 'お問い合わせ内容は必須項目です。';
    }
    
    // 文字数制限
    if (strlen($name) > 100) {
        $errors[] = 'お名前は100文字以内で入力してください。';
    }
    
    if (strlen($company) > 100) {
        $errors[] = '会社名は100文字以内で入力してください。';
    }
    
    if (strlen($message) > 2000) {
        $errors[] = 'お問い合わせ内容は2000文字以内で入力してください。';
    }
    
    // スパム対策（簡易）
    $spam_keywords = ['viagra', 'casino', 'loan', 'bitcoin'];
    $content_lower = strtolower($name . ' ' . $message);
    foreach ($spam_keywords as $keyword) {
        if (strpos($content_lower, $keyword) !== false) {
            $errors[] = '不適切な内容が含まれています。';
            break;
        }
    }
    
    // エラーがある場合
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'エラーが発生しました。',
            'errors' => $errors
        ]);
        exit;
    }
    
    // メール送信処理
    $to = ADMIN_EMAIL;
    $subject = SUBJECT_PREFIX . $name . '様からのお問い合わせ';
    
    // メール本文作成
    $mail_body = "MSG株式会社　お問い合わせフォームからメッセージが届きました。\n\n";
    $mail_body .= "【お問い合わせ内容】\n";
    $mail_body .= "お名前: " . $name . "\n";
    $mail_body .= "会社名: " . ($company ?: '（未入力）') . "\n";
    $mail_body .= "メールアドレス: " . $email . "\n";
    $mail_body .= "お問い合わせ内容:\n" . $message . "\n\n";
    $mail_body .= "【送信情報】\n";
    $mail_body .= "送信日時: " . date('Y-m-d H:i:s') . "\n";
    $mail_body .= "IPアドレス: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $mail_body .= "ユーザーエージェント: " . $_SERVER['HTTP_USER_AGENT'] . "\n";
    
    // メールヘッダー設定
    $headers = [
        'From: ' . $email,
        'Reply-To: ' . $email,
        'X-Mailer: MSG Contact Form',
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    // メール送信
    $mail_sent = mail($to, $subject, $mail_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        // 自動返信メール
        $auto_reply_subject = 'お問い合わせありがとうございます - MSG株式会社';
        $auto_reply_body = $name . " 様\n\n";
        $auto_reply_body .= "この度は、MSG株式会社にお問い合わせいただき、誠にありがとうございます。\n\n";
        $auto_reply_body .= "以下の内容でお問い合わせを承りました。\n";
        $auto_reply_body .= "担当者より2-3営業日以内にご連絡させていただきます。\n\n";
        $auto_reply_body .= "【お問い合わせ内容】\n";
        $auto_reply_body .= "お名前: " . $name . "\n";
        $auto_reply_body .= "会社名: " . ($company ?: '（未入力）') . "\n";
        $auto_reply_body .= "メールアドレス: " . $email . "\n";
        $auto_reply_body .= "お問い合わせ内容:\n" . $message . "\n\n";
        $auto_reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $auto_reply_body .= "MSG株式会社\n";
        $auto_reply_body .= "〒150-0002 東京都渋谷区渋谷3-6-2 YAGI bldg.2 3F\n";
        $auto_reply_body .= "TEL: 03-XXXX-XXXX（平日 9:00-18:00）\n";
        $auto_reply_body .= "Email: contact@msg-corp.co.jp\n";
        $auto_reply_body .= "Website: https://msg-corp.co.jp\n";
        $auto_reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        
        $auto_reply_headers = [
            'From: MSG株式会社 <contact@msg-corp.co.jp>',
            'Reply-To: contact@msg-corp.co.jp',
            'X-Mailer: MSG Contact Form',
            'Content-Type: text/plain; charset=UTF-8'
        ];
        
        mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
        
        // 成功レスポンス
        echo json_encode([
            'success' => true,
            'message' => 'お問い合わせありがとうございます。担当者より2-3営業日以内にご連絡させていただきます。'
        ]);
        
        // ログ記録（オプション）
        error_log("Contact form submission: Name=$name, Email=$email, Company=$company");
        
    } else {
        throw new Exception('メール送信に失敗しました。');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'システムエラーが発生しました。しばらくしてから再度お試しください。'
    ]);
    
    // エラーログ
    error_log("Contact form error: " . $e->getMessage());
}
?>