
echo Meem Extension Creator v2.0

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

# Derive extension slug from extension name
extUpperCamelCase=`echo ${extensionName// /_}`
extUpperCamelCase=`echo $extUpperCamelCase | perl -pe 's/(^|_)./uc($&)/ge;s/_//g'`
extSlug=`echo $extensionName | tr '[:upper:]' '[:lower:]'`
extSlug=`echo ${extSlug// /-}`

# Copy files and replace their contents where necessary
echo ' '
echo Setting up $extensionName Extension...
echo ' '

echo 'Copying Standard Extension files...'
cp -R $PWD/exampleextension/components/Example $PWD/src/components/Extensions
echo 'Setting up Extension files...'

# Rename variables within extension files
perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/components/Extensions/Example/ExampleExtension.tsx
perl -pi -e "s/example/$extSlug/g" $PWD/src/components/Extensions/Example/ExampleExtension.tsx

perl -pi -e "s/Example/$extUpperCamelCase/g" $PWD/src/components/Extensions/Example/ExampleWidget.tsx
perl -pi -e "s/example/$extSlug/g" $PWD/src/components/Extensions/Example/ExampleWidget.tsx

# Rename directories
mv $PWD/src/components/Extensions/Example/ExampleExtension.tsx $PWD/src/components/Extensions/Example/${extUpperCamelCase}Extension.tsx
mv $PWD/src/components/Extensions/Example/ExampleWidget.tsx $PWD/src/components/Extensions/Example/${extUpperCamelCase}Widget.tsx
mv $PWD/src/components/Extensions/Example $PWD/src/components/Extensions/$extUpperCamelCase
mv $PWD/src/pages/[slug]/e/example $PWD/src/pages/[slug]/e/$extSlug

echo 'All done. Get coding!'


echo `$PWD/exampleextension/components/Example`
