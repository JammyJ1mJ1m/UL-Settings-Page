#include <AppCore/App.h>
#include <AppCore/Window.h>
#include <AppCore/Overlay.h>
#include <AppCore/JSHelpers.h>
#include <Ultralight/platform/Logger.h>
#include <Ultralight/Ultralight.h>

#include <string>
#include <vector>
#include <iostream>


#include <sstream>
#include <iostream>

#include <vector>

#include <string>


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

struct  SaveItem {
	std::string name;
	int id;
	int timeStamp;

};

class MyApp : public WindowListener, public ViewListener,
	public LoadListener {
	RefPtr<App> app_;
	RefPtr<Window> window_;
	RefPtr<Overlay> overlay_;



	std::vector<SaveItem> saves_;

public:
	JSValue HandleAudioSliderChange(const JSObject& thisObject, const JSArgs& args);
	JSValue HandleButtonChange(const JSObject& thisObject, const JSArgs& args);

	JSValue GetSaves(const JSObject& thisObject, const JSArgs& args);
	JSValue TriggerSave(const JSObject& thisObject, const JSArgs& args);
	JSValue TriggerOverwrite(const JSObject& thisObject, const JSArgs& args);
	JSValue TriggerDeleteSave(const JSObject& thisObject, const JSArgs& args);


	JSValue HandleRadioButton(const JSObject& thisObject, const JSArgs& args);
	JSValue HandleDropdown(const JSObject& thisObject, const JSArgs& args);
	JSValue HandleDropdownDifficulty(const JSObject& thisObject, const JSArgs& args);


	void SortSaves();

	void OnAddConsoleMessage(ultralight::View* caller, ultralight::MessageSource source,
		ultralight::MessageLevel level, const ultralight::String& message, uint32_t line_number,
		uint32_t column_number, const ultralight::String& source_id) final override;







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


		overlay_->view()->set_view_listener(this);
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

		saves_ = {
			{ "Save 1", 1, 1622547800 },
			{ "Save 2", 2, 1622547900 },
			{ "Save 3", 3, 1622548000 }
		};





		global["SetVolume"] = BindJSCallbackWithRetval(&MyApp::HandleAudioSliderChange);
		global["HandleButtonChange"] = BindJSCallbackWithRetval(&MyApp::HandleButtonChange);

		// sends the saves array to JS
		global["GetSaves"] = BindJSCallbackWithRetval(&MyApp::GetSaves);
		global["TriggerSave"] = BindJSCallbackWithRetval(&MyApp::TriggerSave);
		global["TriggerOverwrite"] = BindJSCallbackWithRetval(&MyApp::TriggerOverwrite);
		global["TriggerDeleteSave"] = BindJSCallbackWithRetval(&MyApp::TriggerDeleteSave);

		global["HandleRadioButton"] = BindJSCallbackWithRetval(&MyApp::HandleRadioButton);
		global["HandleDropdown"] = BindJSCallbackWithRetval(&MyApp::HandleDropdown);
		global["HandleDropdownDifficulty"] = BindJSCallbackWithRetval(&MyApp::HandleDropdownDifficulty);


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


void MyApp::OnAddConsoleMessage(ultralight::View* caller, ultralight::MessageSource source, ultralight::MessageLevel level, const ultralight::String& message, uint32_t line_number, uint32_t column_number, const ultralight::String& source_id)
{
	std::stringstream ss;
	ss << "[" << source_id.utf8().data() << "] " << message.utf8().data();
	if (level == ultralight::MessageLevel::kMessageLevel_Error)
		ss << " (line " << line_number << ", column " << column_number << ")";

	std::cout << ss.str() << std::endl;
}

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



JSValue MyApp::GetSaves(const JSObject& thisObject, const JSArgs& args)
{
	// Create a JSArray to hold the saves
	JSArray savesArray;

	for (const auto& save : saves_) {
		// Create a JSObject for each save item
		JSObject saveObject;
		saveObject["name"] = JSValue(save.name.c_str());
		saveObject["id"] = JSValue(static_cast<double>(save.id));
		saveObject["timeStamp"] = JSValue(static_cast<double>(save.timeStamp));

		// Push the JSObject itself (not a pointer) into the array
		savesArray.push(JSValue(saveObject));
	}

	// Return the array as a JSValue
	return JSValue(savesArray);
}

JSValue MyApp::TriggerSave(const JSObject& thisObject, const JSArgs& args)
{
	std::cout << "Save Game Triggered" << std::endl;

	if (args[0].IsString())
	{
		ultralight::String ulString = args[0].ToString();
		std::string strName = std::string(ulString.utf8().data());


		SaveItem newSave;
		newSave.name = strName;
		newSave.id = static_cast<int>(saves_.size()) + 1; // Incremental ID
		newSave.timeStamp = static_cast<int>(time(nullptr)); // Current timestamp
		saves_.push_back(newSave);

		SortSaves();

	}


	return JSValue();
}

JSValue MyApp::TriggerOverwrite(const JSObject& thisObject, const JSArgs& args)
{
	if (args[0].IsNumber())
	{
		// find the save item with the given ID
		int id = static_cast<int>(args[0].ToNumber());


		SaveItem& save = saves_[id - 1];

		// Handle specific overwrite logic here
		save.timeStamp = static_cast<int>(time(nullptr)); // Update timestamp to current time
		SortSaves();

	}
	return JSValue();
}

JSValue MyApp::TriggerDeleteSave(const JSObject& thisObject, const JSArgs& args)
{
	if (args[0].IsNumber())
	{
		// find the save item with the given ID
		int id = static_cast<int>(args[0].ToNumber());
		// Adjust for zero-based index
	   // Remove the save item with the given ID
		auto it = std::remove_if(saves_.begin(), saves_.end(), [id](const SaveItem& save) {
			return save.id == id;
			});
		if (it != saves_.end()) {
			saves_.erase(it, saves_.end());
			std::cout << "Save with ID " << id << " deleted." << std::endl;
		}
		else {
			std::cout << "Save with ID " << id << " not found." << std::endl;
		}
		SortSaves();

		return JSValue(true);
	}

	return JSValue();
}

JSValue MyApp::HandleRadioButton(const JSObject& thisObject, const JSArgs& args)
{
	if (args.size() > 0 && args[0].IsBoolean() && args[1].IsString()) {

		ultralight::String ulString = args[1].ToString();
		std::string strName = std::string(ulString.utf8().data());

		if (strName == "vsync") {
			bool enableVSync = args[0].ToBoolean();
			std::cout << "VSync is now " << (enableVSync ? "enabled" : "disabled") << std::endl;
			// do some vsync logic here
		}
		else if (strName == "fullscreen") {
			bool enableFullscreen = args[0].ToBoolean();
			std::cout << "Fullscreen is now " << (enableFullscreen ? "enabled" : "disabled") << std::endl;
			// do some fullscreen logic here
		}
		else {
			std::cout << "Unknown radio button name: " << strName << std::endl;
		return JSValue(false);
		}
		
	}
	return JSValue(true);
}


// I do not currently know of a nice way to handle multiple dropdowns, unless you do what i've done for the radio buttons and also pass some sort of ID
JSValue MyApp::HandleDropdown(const JSObject& thisObject, const JSArgs& args)
{
	if (args.size() > 0 && args[0].IsNumber()) {
		int selectedIndex = static_cast<int>(args[0].ToNumber());
		std::cout << "Dropdown selection changed to index: " << selectedIndex << std::endl;


		return JSValue(true); 
	}
	else {
		std::cout << "Invalid arguments for HandleDropdown" << std::endl;
		return JSValue(false);
	}

	return JSValue(true);
}

JSValue MyApp::HandleDropdownDifficulty(const JSObject& thisObject, const JSArgs& args)
{
	if (args.size() > 0 && args[0].IsNumber()) {
		int selectedIndex = static_cast<int>(args[0].ToNumber());
		std::cout << "Difficulty selection changed to index: " << selectedIndex << std::endl;


		return JSValue(true);
	}
	else {
		std::cout << "Invalid arguments for HandleDropdown" << std::endl;
		return JSValue(false);
	}

	return JSValue(true);
}

void MyApp::SortSaves()
{
	// sort the array based on the timeStamp with the newset time stamp being element 0
	std::sort(saves_.begin(), saves_.end(), [](const SaveItem& a, const SaveItem& b) {
		return a.timeStamp > b.timeStamp; // Sort in descending order
		});

	// we now want to go through and readjust each of the save ID to match the array index
	for (size_t i = 0; i < saves_.size(); ++i) {
		saves_[i].id = static_cast<int>(i + 1);
	}
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