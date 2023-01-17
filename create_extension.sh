
echo Meem Extension Creator v1.0

# Get some user input
echo ' '
read -p 'What is your Extension Name?: ' extensionName
echo ' '

# Name validation
if [ ${#extensionName} -eq 0 ]
then
    echo Invalid Extension name. Please try again.
    echo ' '
    exit 
fi

if [ ${#extensionName} -gt 19 ]
then
    echo Invalid Extension name. Please pick a name less than 20 characters.
    echo ' '
    exit 
fi

echo What kind of Extension are you building?
echo ' '

PS3='Enter your choice: '
extensionTypes=("Standard" "Link")
select extType in "${extensionTypes[@]}"
do
    case $extType in
        "Standard (This Extension has a homepage and/or Widget)")
            break
            ;;
        "Link (This Extension is just a link to another website)")
            break
            ;;
    esac
    break
done

# Derive extension slug from extension name
extUpperCamelCase=`echo ${extensionName// /_}`
extUpperCamelCase=`echo $extUpperCamelCase | perl -pe 's/(^|_)./uc($&)/ge;s/_//g'`
extSlug=`echo $extensionName | tr '[:upper:]' '[:lower:]'`
extSlug=`echo ${extSlug// /-}`

# Copy files and replace their contents where necessary
echo ' '
echo Setting up $extensionName Extension, which is a $extType Extension...
echo ' '
if [ $extType = "Standard" ]
then
    echo 'Copying Standard Extension files...'
    cp -R $PWD/exampleextension/components/Example $PWD/src/components/Extensions
    cp -R $PWD/exampleextension/pages/example $PWD/src/pages/[slug]/e
    echo 'Setting up Extension files...'

    # Rename variables within extension files
    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/components/Extensions/Example/ExampleExtensionHome.tsx
    perl -pi -e "s/example/$extSlug/g" $PWD/src/components/Extensions/Example/ExampleExtensionHome.tsx

    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/components/Extensions/Example/ExampleExtensionSettings.tsx
    perl -pi -e "s/example/$extSlug/g" $PWD/src/components/Extensions/Example/ExampleExtensionSettings.tsx

    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/components/Extensions/Example/ExampleWidget.tsx
    perl -pi -e "s/example/$extSlug/g" $PWD/src/components/Extensions/Example/ExampleWidget.tsx
    
    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/pages/[slug]/e/example/index.tsx
    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/pages/[slug]/e/example/index.tsx
    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/pages/[slug]/e/example/settings.tsx
    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/pages/[slug]/e/example/settings.tsx

    # Rename directories
    mv $PWD/src/components/Extensions/Example/ExampleExtensionHome.tsx $PWD/src/components/Extensions/Example/${extUpperCamelCase}ExtensionHome.tsx
    mv $PWD/src/components/Extensions/Example/ExampleExtensionSettings.tsx $PWD/src/components/Extensions/Example/${extUpperCamelCase}ExtensionSettings.tsx
    mv $PWD/src/components/Extensions/Example/ExampleWidget.tsx $PWD/src/components/Extensions/Example/${extUpperCamelCase}Widget.tsx
    mv $PWD/src/components/Extensions/Example $PWD/src/components/Extensions/$extUpperCamelCase
    mv $PWD/src/pages/[slug]/e/example $PWD/src/pages/[slug]/e/$extSlug

    echo 'All done. Get coding!'
    exit 
fi

if [ $extType = "Link" ]
then
    echo 'Copying Link Extension files...'
        cp -R $PWD/exampleextension/components/ExampleLink $PWD/src/components/Extensions
        cp -R $PWD/exampleextension/pages/examplelink $PWD/src/pages/[slug]/e
    echo 'Setting up Extension files...'
     
    # Rename variables within extension files
    perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/components/Extensions/ExampleLink/ExampleLinkExtensionSettings.tsx
    perl -pi -e "s/example/$extSlug/g" $PWD/src/components/Extensions/ExampleLink/ExampleLinkExtensionSettings.tsx
    perl -pi -e "s/ExampleLinkExtensionSettings/${extUpperCamelCase}LinkExtensionSettings/g" $PWD/src/pages/[slug]/e/examplelink/index.tsx
    perl -pi -e "s/ExampleLink/${extUpperCamelCase}Link/g" $PWD/src/pages/[slug]/e/examplelink/index.tsx
    perl -pi -e "s/Example Extension Settings/${extensionName} Settings/g" $PWD/src/pages/[slug]/e/examplelink/index.tsx

    # Rename directories
    mv $PWD/src/components/Extensions/ExampleLink/ExampleLinkExtensionSettings.tsx $PWD/src/components/Extensions/ExampleLink/${extUpperCamelCase}LinkExtensionSettings.tsx
    mv $PWD/src/components/Extensions/ExampleLink $PWD/src/components/Extensions/${extUpperCamelCase}Link
    mv $PWD/src/pages/[slug]/e/examplelink $PWD/src/pages/[slug]/e/$extSlug
    echo 'All done. Get coding!'
    exit 
fi

echo `$PWD/exampleextension/components/Example`
