#include <AppCore/App.h>
#include <AppCore/Window.h>
#include <AppCore/Overlay.h>
#include <AppCore/JSHelpers.h>
#include <Ultralight/platform/Logger.h>

#include <string>
#include <vector>
#include <iostream>

using namespace ultralight;


#ifdef _WIN32
#include <windows.h>
#include <iostream>
#include <fstream>


// I forgor how to enable console, this is what ChatGPT told me
void EnableConsole() {
	AllocConsole();
	freopen("CONOUT$", "w", stdout);
	freopen("CONOUT$", "w", stderr);
	freopen("CONIN$", "r", stdin);
	std::ios::sync_with_stdio(); // Sync C++ streams with C stdio
}
#endif


///
///  Welcome to Sample 4!
///
///  In this sample we'll show how to integrate C++ code with JavaScript.
///
///  We will introduce the DOMReady event and use it to bind a C++ callback to a JavaScript
///  function on our page. Later, when that callback is triggered, we will execute some JavaScript
///  to update a hidden message on the page.
///
///  __JavaScriptCore and AppCore__
///
///  Ultralight integrates the full JavaScriptCore engine (the same JS engine in Safari on macOS
///  and iOS). The SDK includes full C API bindings to JavaScriptCore which gives you a great deal
///  of flexibility but can be a little daunting for first-time users.
/// 
///  To help simplify things, AppCore provides a simple C++ wrapper over JavaScriptCore
///  (@see JSHelpers.h). We'll be using this wrapper for the sake of convenience in this sample.
///
class MyApp : public WindowListener,
	public LoadListener {
	RefPtr<App> app_;
	RefPtr<Window> window_;
	RefPtr<Overlay> overlay_;
public:
	JSValue HandleAudioSliderChange(const JSObject& thisObject, const JSArgs& args);
	JSValue HandleButtonChange(const JSObject& thisObject, const JSArgs& args);

	MyApp() {
		///
		/// Create our main App instance.
		///
		/// The App class is responsible for the lifetime of the application and is required to create
		/// any windows.
		///
		app_ = App::Create();

		///
		/// Create our Window.
		///
		/// This command creates a native platform window and shows it immediately.
		/// 
		window_ = Window::Create(app_->main_monitor(), 1280, 720, false, kWindowFlags_Titled);

		///
		/// Set our window title.
		///
		window_->SetTitle("Ultralight Sample 4 - JavaScript");

		///
		/// Register our MyApp instance as a WindowListener so we can handle the Window's OnClose
		/// event below.
		///
		window_->set_listener(this);

		///
		/// Create an Overlay using the same dimensions as our Window.
		///
		overlay_ = Overlay::Create(window_, window_->width(), window_->height(), 0, 0);

		///
		/// Register our MyApp instance as a load listener so we can handle the View's OnDOMReady
		/// event below.
		///
		overlay_->view()->set_load_listener(this);

		///
		/// Load a string of HTML (we're using a C++11 Raw String Literal)
		///
		// overlay_->view()->LoadHTML(htmlString());
		overlay_->view()->LoadURL("file:///app.html");

	}

	virtual ~MyApp() {}

	///
	/// Our native JavaScript callback. This function will be called from JavaScript by calling
	/// GetMessage(). We bind the callback within the DOMReady callback defined below.
	///
	JSValue GetMessage(const JSObject& thisObject, const JSArgs& args) {
		///
		/// Return our message to JavaScript as a JSValue.
		///
		return JSValue("Hello from C++!<br/>Ultralight rocks!");
	}

	///
	/// Inherited from LoadListener, called when the page has finished parsing the document.
	///
	/// We perform all our JavaScript initialization here.
	///
	virtual void OnDOMReady(ultralight::View* caller,
		uint64_t frame_id,
		bool is_main_frame,
		const String& url) override {
		///
		/// Set our View's JSContext as the one to use in subsequent JSHelper calls
		///
		RefPtr<JSContext> context = caller->LockJSContext();
		SetJSContext(context->ctx());

		///
		/// Get the global object (this would be the "window" object in JS)
		///
		JSObject global = JSGlobalObject();

		///
		/// Bind MyApp::GetMessage to the JavaScript function named "GetMessage".
		///
		/// You can get/set properties of JSObjects by using the [] operator with the following types
		/// as potential property values:
		///  - JSValue
		///      Represents a JavaScript value, eg String, Object, Function, etc.
		///  - JSCallback 
		///      Typedef of std::function<void(const JSObject&, const JSArgs&)>)
		///  - JSCallbackWithRetval 
		///      Typedef of std::function<JSValue(const JSObject&, const JSArgs&)>)
		///
		/// We use the BindJSCallbackWithRetval macro to bind our C++ class member function to our
		/// JavaScript callback.
		///
		global["GetMessage"] = BindJSCallbackWithRetval(&MyApp::GetMessage);


#pragma region Custom implementation stuff

		global["SetVolume"] = BindJSCallbackWithRetval(&MyApp::HandleAudioSliderChange);
		global["HandleButtonChange"] = BindJSCallbackWithRetval(&MyApp::HandleButtonChange);

#pragma endregion

	}

	///
	/// Inherited from WindowListener, called when the Window is closed.
	/// 
	/// We exit the application when the window is closed.
	///
	virtual void OnClose(ultralight::Window* window) override {
		app_->Quit();
	}

	///
	/// Inherited from WindowListener, called when the Window is resized.
	/// 
	/// (Not used in this sample)
	///
	virtual void OnResize(ultralight::Window* window, uint32_t width, uint32_t height) override {}

	void Run() {
		app_->Run();
	}
};



#pragma region Custom callbacks stuff


JSValue MyApp::HandleAudioSliderChange(const JSObject& thisObject, const JSArgs& args) {
	if (args.size() >= 2 && args[0].IsString() && args[1].IsNumber()) {

		ultralight::String ulString = args[0].ToString();
		std::string volumeType = std::string(ulString.utf8().data());
		int value = (int)args[1].ToNumber();
	
		std::cout << "[ VOLUME ] " << volumeType << " - " << value << std::endl;
	}
	else {
		std::cout << "Invalid args to SetVolume" << std::endl;
	}

	return JSValue();
}



JSValue MyApp::HandleButtonChange(const JSObject& thisObject, const JSArgs& args) {
	
	// Handle some custom logic here:
	if (args[0].IsString())
	{
		ultralight::String ulString = args[0].ToString();
		std::string str = std::string(ulString.utf8().data());

		std::cout << " [ FROM JS ]" << str << std::endl;
	}

	// Can then send some data back to JS
	return JSValue("Hello JS world!");
}

#pragma endregion





int main() {
#ifdef _WIN32
	EnableConsole();
#endif

	MyApp app;
	app.Run();

	return 0;
}

