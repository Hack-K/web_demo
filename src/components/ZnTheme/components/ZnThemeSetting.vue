<template>
  <ul v-if="theme.showThemeSetting" class="theme-setting">
    <li @click="handleOpenTheme">
      <a>
        <zn-icon :iconName="'brush-2-line'" />
        <p>主题配置</p>
      </a>
    </li>
    <li @click="randomTheme">
      <a>
        <zn-icon :iconName="'apps-line'" />
        <p>随机换肤</p>
      </a>
    </li>
    <li @click="removeLocalStorage">
      <a>
        <zn-icon :iconName="'delete-bin-4-line'" />
        <p>清理缓存</p>
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ZnThemeSetting',
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
    }),
  },
  methods: {
    handleOpenTheme() {
      this.$baseEventBus.$emit('theme')
    },
    randomTheme() {
      this.$baseEventBus.$emit('random-theme')
    },
    removeLocalStorage() {
      localStorage.clear()
      location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
.theme-setting {
  position: fixed;
  top: 65%;
  right: 0;
  z-index: $base-z-index + 1;
  padding: 10px 0 0 0;
  margin: 0;
  text-align: center;
  cursor: pointer;
  background: $base-fill-1;
  border: 1px solid $base-border-color;
  border-top-left-radius: $base-border-radius + 3;
  border-bottom-left-radius: $base-border-radius + 3;
  box-shadow: 0 0 50px 0 rgb(82 63 105 / 15%);
  transform: translateY(-50%);

  > li {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px 10px 10px;
    margin: 0;
    list-style: none;

    &:nth-child(2) {
      [class*='ri-'] {
        animation: rotate 6s linear infinite;
      }
    }

    $colors: (
      1: #3698fd,
      2: #1bc3bb,
      3: #faa500,
      4: #b37feb,
      5: #ef4c5d,
    );

    @each $key, $color in $colors {
      &:nth-child(#{$key}) {
        a {
          color: $color;
          background: mix($base-fill-1, $color, 90%);
          transition: color 0.15s ease, background-color 0.15s ease,
            border-color 0.15s ease, box-shadow 0.15s ease,
            -webkit-box-shadow 0.15s ease;

          &:hover {
            color: $base-fill-1;
            background: $color;
          }
        }
      }
    }

    a {
      display: inline-block;
      width: 60px;
      height: 60px;
      padding-top: 10px;
      text-align: center;
      background: #f6f8f9;
      border-radius: $base-border-radius + 3;

      p {
        padding: 0;
        margin: 0;
        overflow: hidden;
        font-size: $base-font-size-small;
        line-height: 25px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
