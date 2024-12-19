'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    dataNascita: '',
    genere: '',
    tipo: '',
    titoloStudio: '',
    competenze: '',
    occupazione: '',
    cv: null,
    portfolio: []
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, cv: e.target.files[0] }))
  }

  const handleNext = () => setStep(2)
  const handleBack = () => setStep(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-emerald-600">
          Registrazione Mentore o Mentee
        </CardTitle>
        <p className="text-gray-600">
          Compila il form per registrarti come Mentore o Mentee
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cognome">Cognome</Label>
                  <Input
                    id="cognome"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascita">Data di Nascita</Label>
                <Input
                  id="dataNascita"
                  name="dataNascita"
                  type="date"
                  value={formData.dataNascita}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Genere</Label>
                <RadioGroup
                  name="genere"
                  value={formData.genere}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, genere: value }))
                  }
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uomo" id="uomo" />
                    <Label htmlFor="uomo">Uomo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donna" id="donna" />
                    <Label htmlFor="donna">Donna</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="altro" id="altro" />
                    <Label htmlFor="altro">Altro</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Avanti
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo Utente</Label>
                <RadioGroup
                  name="tipo"
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tipo: value }))
                  }
                  required
                  className="mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentor" id="mentor" />
                    <Label htmlFor="mentor">Mentor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentee" id="mentee" />
                    <Label htmlFor="mentee">Mentee</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titoloStudio">Titolo di Studio</Label>
                <Select
                  value={formData.titoloStudio}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, titoloStudio: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona il tuo titolo di studio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="laurea">Laurea</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="dottorato">Dottorato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competenze">Competenze</Label>
                <Textarea
                  id="competenze"
                  name="competenze"
                  value={formData.competenze}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupazione">Occupazione</Label>
                <Input
                  id="occupazione"
                  name="occupazione"
                  value={formData.occupazione}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv">CV (opzionale)</Label>
                <Input
                  id="cv"
                  name="cv"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div className="space-y-2">
                <Label>Portfolio (opzionale)</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-600"
                >
                  + Aggiungi al Portfolio
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Indietro
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Registrati
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

