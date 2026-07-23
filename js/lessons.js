const LESSONS = [
  {
    id: 1,
    title: "Training introduction",
    goal: "Understand the complete LiaScript-to-Android workflow.",
    result: "You know what will be created and which stages are involved.",
    quiz: {
      question: "What is the final output of this training?",
      options: ["A PowerPoint file", "An Android APK", "A PDF document"],
      correct: 1
    },
    shots: [
      {type:"camera", shot:"wide", caption:"Welcome to the Android Development Virtual Lab.", action:"Enter the training laboratory."},
      {type:"speak", text:"In this training, you will convert a LiaScript course into an Android application."},
      {type:"camera", shot:"monitor", caption:"The complete workflow has four stages: prepare, configure, build, and test.", action:"Review the workflow."},
      {type:"show", view:"browser", caption:"First, we begin with the LiaScript course.", action:"Open the LiaScript course."},
      {type:"show", view:"phone", caption:"At the end, the course runs as an Android app.", action:"Preview the final Android app."}
    ]
  },
  {
    id: 2,
    title: "Required tools",
    goal: "Identify the software needed before development starts.",
    result: "Android Studio, Java 17, a browser, and a LiaScript course are ready.",
    quiz: {
      question: "Which Java version is used in this training?",
      options: ["Java 8", "Java 11", "Java 17"],
      correct: 2
    },
    shots: [
      {type:"show", view:"desktop", caption:"Before starting, prepare all required tools.", action:"Review the desktop tools."},
      {type:"cursor", target:"studio", caption:"Android Studio is used to create and build the Android project.", action:"Identify Android Studio."},
      {type:"cursor", target:"terminal", caption:"Terminal is used to run project and build commands.", action:"Identify Terminal."},
      {type:"cursor", target:"browser", caption:"A browser is used to test the LiaScript course.", action:"Identify the browser."},
      {type:"speak", text:"Use Java 17 for a modern and compatible Android build environment."}
    ]
  },
  {
    id: 3,
    title: "Create the Android project",
    goal: "Create an empty Android Studio project.",
    result: "A new Android project is available with a MainActivity file.",
    quiz: {
      question: "Which project template should beginners select?",
      options: ["Empty Activity", "Game Activity", "Maps Activity"],
      correct: 0
    },
    shots: [
      {type:"show", view:"desktop", caption:"Open Android Studio.", action:"Open Android Studio."},
      {type:"cursor", target:"studio", caption:"The cursor opens Android Studio.", action:"Select Android Studio."},
      {type:"show", view:"android", caption:"Choose New Project and select Empty Activity.", action:"Create a new Empty Activity project."},
      {type:"tree", text:"app/\n ├─ manifests/\n ├─ kotlin/\n │   └─ MainActivity.kt\n └─ res/", caption:"Android Studio creates the basic project structure.", action:"Inspect the project structure."}
    ]
  },
  {
    id: 4,
    title: "Configure Java and Gradle",
    goal: "Prepare the project for Java 17 and WebView.",
    result: "Gradle configuration is ready for compilation.",
    quiz: {
      question: "Why is Gradle important?",
      options: ["It controls the Android build", "It edits photos", "It creates email accounts"],
      correct: 0
    },
    shots: [
      {type:"show", view:"android", caption:"Open the module Gradle file.", action:"Open the Gradle configuration."},
      {type:"code", tab:"build.gradle.kts", text:"android {\n  compileSdk = 35\n\n  compileOptions {\n    sourceCompatibility = JavaVersion.VERSION_17\n    targetCompatibility = JavaVersion.VERSION_17\n  }\n}", caption:"Set source and target compatibility to Java 17.", action:"Configure Java 17."},
      {type:"speak", text:"After changing Gradle, synchronize the project so Android Studio applies the configuration."},
      {type:"build", text:"> Task :app:prepareKotlinBuildScriptModel\nGradle sync finished successfully", caption:"Gradle synchronization completes.", action:"Sync the project."}
    ]
  },
  {
    id: 5,
    title: "Add Internet permission",
    goal: "Allow the application to load LiaScript web content.",
    result: "The Android app has Internet permission.",
    quiz: {
      question: "Where is Internet permission declared?",
      options: ["AndroidManifest.xml", "README.md", "settings.gradle"],
      correct: 0
    },
    shots: [
      {type:"show", view:"android", caption:"Open AndroidManifest.xml.", action:"Open AndroidManifest.xml."},
      {type:"code", tab:"AndroidManifest.xml", text:'<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n\n  <uses-permission android:name="android.permission.INTERNET" />\n\n  <application ...>\n  </application>\n</manifest>', caption:"Add Internet permission above the application element.", action:"Add Internet permission."},
      {type:"highlight", caption:"This permission allows WebView to access the online LiaScript course.", action:"Verify the permission."}
    ]
  },
  {
    id: 6,
    title: "Create the WebView activity",
    goal: "Load the LiaScript course inside the Android application.",
    result: "MainActivity displays the course in a WebView.",
    quiz: {
      question: "Which Android component displays web content?",
      options: ["TextView", "WebView", "ImageButton"],
      correct: 1
    },
    shots: [
      {type:"show", view:"android", caption:"Open MainActivity.kt.", action:"Open MainActivity.kt."},
      {type:"code", tab:"MainActivity.kt", text:'class MainActivity : AppCompatActivity() {\n  override fun onCreate(savedInstanceState: Bundle?) {\n    super.onCreate(savedInstanceState)\n\n    val webView = WebView(this)\n    webView.settings.javaScriptEnabled = true\n    webView.webViewClient = WebViewClient()\n    webView.loadUrl("https://liascript.github.io/course/?YOUR_COURSE_URL")\n    setContentView(webView)\n  }\n}', caption:"Create a WebView, enable JavaScript, and load the LiaScript URL.", action:"Add WebView code."},
      {type:"highlight", caption:"Replace YOUR_COURSE_URL with the raw GitHub link to your LiaScript Markdown file.", action:"Insert the course URL."}
    ]
  },
  {
    id: 7,
    title: "Build the APK",
    goal: "Compile the Android project into an installable APK.",
    result: "A debug APK is generated successfully.",
    quiz: {
      question: "Which message confirms a successful build?",
      options: ["BUILD SUCCESSFUL", "Permission denied", "File not found"],
      correct: 0
    },
    shots: [
      {type:"show", view:"terminal", caption:"Open Terminal in the Android project folder.", action:"Open Terminal."},
      {type:"type", command:"./gradlew assembleDebug", output:"> Task :app:compileDebugKotlin\n> Task :app:packageDebug", caption:"Run the Gradle debug build command.", action:"Build the debug APK."},
      {type:"build", text:"BUILD SUCCESSFUL in 18s\n34 actionable tasks: 34 executed", caption:"The project builds successfully.", action:"Confirm the build."},
      {type:"success", caption:"The APK is available in app/build/outputs/apk/debug/.", action:"Locate the APK."}
    ]
  },
  {
    id: 8,
    title: "Install and test",
    goal: "Install the APK and verify that the course works.",
    result: "The LiaScript Android app opens correctly on the phone.",
    quiz: {
      question: "What should you test after installation?",
      options: ["Only the app icon", "Navigation, audio, links, and layout", "Nothing"],
      correct: 1
    },
    shots: [
      {type:"show", view:"phone", caption:"Connect an Android phone or start an emulator.", action:"Prepare the Android device."},
      {type:"install", caption:"The APK is transferred and installed.", action:"Install the APK."},
      {type:"phone", text:"LiaScript course loading…", caption:"Open the application.", action:"Launch the app."},
      {type:"phone", text:"German A1 Training\nLesson 1 · Introduction", caption:"The LiaScript course is now running inside Android.", action:"Test the course."},
      {type:"success", caption:"Training complete. The Android application works successfully.", action:"Complete the training."}
    ]
  }
];