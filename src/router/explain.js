const explain = {
    name: 'Demo', //首字母大写，一定要与vue文件的name对应起来，name名不可重复，用于noKeepAlive缓存控制（该项特别重要）
    path: '/', //注意根路由（第一条数据）是斜线，第一级路由必须带斜线，第二级路由开始不能，path名不可重复
    component: 'Layout', //后端路由时此项为字符串，前端路由时此项为import的function，第一级路由是为Layout，其余为层级为vue的文件路径
    redirect: '', //重定向到子路由，格式从第一级路由开始拼接（默认可不写）
    meta: {
      hidden: true, //2021年5月23日后新版用法：是否显示在菜单中显示隐藏路由（默认值：false）
      levelHidden: false, //2021年5月23日后新版用法：是否显示在菜单中显示隐藏一级路由（默认值：false）
      title: 'title', //菜单、面包屑、多标签页显示的名称
      guard: ['Admin', '...'], //2021年9月份版本，当config/settings.js中rolesControl配置开启时，用于控制角色（简写）
      guard: {//2021年9月份新版本，当config/settings.js中rolesControl配置开启时，用于控制角色（全写）
        role: ['Admin', '...'],
        mode: 'allOf', //allOf: 数组内所有角色都拥有，返回True oneOf: 数组内拥有任一角色，返回True(等价第1种数据) except: 不拥有数组内任一角色，返回True(取反)
      },
      icon: '', //新版
      isCustomSvg: false, //是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon下，然后icon字段配置上你的图标名）
      noKeepAlive: true, //当前路由是否不缓存（默认值：false）
      noClosable: true, //当前路由是否可关闭多标签页，同上（2021年10月后新版支持）
      noColumn: false, //是否隐藏分栏，仅在分栏布局中二级路由生效（默认值：false）
      badge: 'New', //badge小标签（只支持子级，String例行，支持自定义）
      tabHidden: true, //当前路由是否不显示多标签页（默认值：false，不推荐使用）
      target: '_blank', //是否浏览新标签页打开（不适用于分栏布局左侧tab部分）
      activeMenu: '', //高亮指定菜单，要从跟路由的path开始拼接
      dot: false, //小圆点（默认值：false）
      dynamicNewTab: false, //动态传参路由是否新开标签页（默认值：false）
      breadcrumbHidden: true, //面包屑是否显示（默认值：false）
      children: [{}, {}],
      //"affix": true, //当前路由是否固定多标签页（旧版）
      //"roles": ["admin", "..."], //旧版本，当config/settings.js中rolesControl配置开启时，用于控制角色（简写）
      //"roles": {
      //旧版本当config/settings.js中rolesControl配置开启时，用于控制角色（全写）
      //"role": ["admin", "..."],
      //"ability": ["READ", "WRITE", "DELETE"], //ability: ["READ","WRITE"],
      //"mode": "allOf" //allOf: 数组内所有角色都拥有，返回True oneOf: 数组内拥有任一角色，返回True(等价第1种数据) except: 不拥有数组内任一角色，返回True(取反)
      //},
      //"remixIcon": "", //旧版remix图标
      //"isCustomSvgIcon": false, //旧版，是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）
    },
    //"hidden": true, //2021年5月23日前旧版2.0.4版本前的用法：是否显示在菜单中显示隐藏路由（默认值：false）
    //"menuHidden": false, //2021年5月23日前旧版2.0.4版本前的用法：是否显示在菜单中显示隐藏一级路由（默认值：false，除分栏布局有效）
    //"alwaysShow": true, //2021年5月23日前旧版2.0.4版本前的用法：当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
}