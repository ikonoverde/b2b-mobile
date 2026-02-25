import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
    return (
        <>
            <Head title="Términos y Condiciones" />

            <div className="px-6 pb-10 pt-6">
                <Link href="/register" className="text-brand-accent-brown mb-4 inline-flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Link>

                <h1 className="text-brand-green text-2xl font-bold">Términos y Condiciones</h1>
                <p className="text-brand-muted-text mt-1 text-sm">Última actualización: febrero 2026</p>

                <div className="text-brand-muted-text mt-6 flex flex-col gap-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar esta plataforma, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de
                            acuerdo con alguna parte de estos términos, no deberá utilizar nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">2. Uso de la Plataforma</h2>
                        <p>
                            Esta plataforma está destinada exclusivamente para uso comercial entre empresas (B2B). Los usuarios deben ser
                            representantes autorizados de una empresa legalmente constituida en México con RFC válido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">3. Registro y Cuenta</h2>
                        <p>
                            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Toda actividad realizada bajo su cuenta
                            será su responsabilidad. Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">4. Pedidos y Pagos</h2>
                        <p>
                            Todos los pedidos realizados a través de la plataforma están sujetos a disponibilidad y confirmación. Los precios
                            mostrados incluyen impuestos aplicables salvo que se indique lo contrario. Nos reservamos el derecho de cancelar pedidos
                            en caso de errores de precio o disponibilidad.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">5. Envíos y Entregas</h2>
                        <p>
                            Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad del producto. No nos hacemos
                            responsables por retrasos causados por circunstancias fuera de nuestro control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">6. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido de esta plataforma, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes y software, es
                            propiedad de la empresa y está protegido por las leyes de propiedad intelectual aplicables.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">7. Limitación de Responsabilidad</h2>
                        <p>
                            En la medida permitida por la ley, no seremos responsables por daños indirectos, incidentales, especiales o consecuentes
                            que resulten del uso o la imposibilidad de uso de nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">8. Modificaciones a los Términos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al ser
                            publicados en la plataforma. El uso continuado de nuestros servicios constituye la aceptación de los términos modificados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-brand-green mb-2 text-base font-semibold">9. Contacto</h2>
                        <p>
                            Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de los canales de atención
                            disponibles en la plataforma.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
