app.controller('transcriberCtrl', ($scope) => {
    $scope.params = getObjectFromLocalStorage('sustmayo_params') || {
        "spanish_text" : spanish_text_example,
        "rules_filter": "",
        "highlight_transformed_words": false
    };
    $scope.params.rules = rules; // because rules cannot be recovered from local storage
    $scope.sustmayo_text = "";
    $scope.applied_rules = {};
    $scope.filter_rules = (rules, filter) => {
        return rules.filter((rule) => JSON.stringify(rule).indexOf(filter) >=0);
    };
    $scope.num_active_rules = (rules) => {
        return rules.filter((rule) => rule.active).length;
    };

    const on_params_change = function() {
        const result = to_sustmayo_objects($scope.params.spanish_text, $scope.params.rules);
        $scope.sustmayo_objects = result[0];
        $scope.sustmayo_html = to_sustmayo_html(result[0], $scope.params.highlight_transformed_words);
        $scope.applied_rules = result[1];
        setObjectInLocalStorage('sustmayo_params', $scope.params);
    };

    $scope.$watch("params", on_params_change, true);

    setModelVersionInLocalStorage();
});