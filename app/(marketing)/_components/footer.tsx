import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">

        {/* Политика конфиденциальности */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Политика конфиденциальности
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Политика конфиденциальности</AlertDialogTitle>
              <AlertDialogDescription>
                <p><strong>Сбор информации:</strong> Мы собираем ваше имя, email и данные о действиях на сайте для улучшения услуг и персонализации контента.</p>
                <p><strong>Использование информации:</strong> Данные используются для предоставления услуг, улучшения сайта и маркетинга. Мы можем отправлять уведомления и предложения.</p>
                <p><strong>Обмен данными:</strong> Ваши данные не передаются третьим лицам без вашего согласия, кроме случаев, предусмотренных законом. Мы можем делиться данными с партнёрами для выполнения услуг.</p>
                <p><strong>Безопасность данных:</strong> Мы принимаем меры для защиты данных, но не можем гарантировать абсолютную безопасность при передаче через интернет.</p>
                <p><strong>Права пользователей:</strong> Вы можете получить доступ к своим данным, исправить их или удалить. Вы также можете отказаться от маркетинговых сообщений.</p>
                <p><strong>Файлы cookie:</strong> Мы используем cookies для улучшения работы сайта и анализа трафика. Вы можете управлять настройками cookies в браузере.</p>
                <p><strong>Изменения в политике:</strong> Мы можем обновлять политику конфиденциальности. Изменения будут опубликованы на этой странице.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Закрыть</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        {/* Правила и условия */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Правила и условия
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Правила и условия</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Добро пожаловать на aiBazar. Используя наш сайт, вы соглашаетесь с этими условиями. Если вы не согласны, пожалуйста, не используйте сайт.</p>

                <p><strong>Авторские права</strong></p>
                <p>Все материалы на aiBazar защищены авторским правом. Их можно использовать только для личных нужд с указанием источника.</p>

                <p><strong>Запрещенные действия</strong></p>
                <p>Нельзя повторно публиковать, продавать или копировать материалы с сайта без разрешения. Контент должен использоваться в рамках закона.</p>

                <p><strong>Отказ от ответственности</strong></p>
                <p>Мы не несем ответственности за убытки, возникшие из-за использования сайта. Сайт может содержать партнерские ссылки, за которые мы можем получать комиссию.</p>

                <p><strong>Пользовательский контент</strong></p>
                <p>Мы не несем ответственности за контент, загруженный пользователями.</p>

                <p><strong>Изменения</strong></p>
                <p>Мы можем изменять условия использования сайта в любое время.</p>

                <p><strong>Регулирующее законодательство</strong></p>
                <p>Эти условия регулируются законодательством Российской Федерации.</p>

                <p><strong>Свяжитесь с нами</strong></p>
                <p>Для вопросов свяжитесь с нами по адресу mpmolokoedov@gmail.com.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Закрыть</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>



      </div>
    </div>
  );
};
